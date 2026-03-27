import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private store: RateLimitStore = {};
  private readonly windowMs = 15 * 60 * 1000;
  private readonly maxRequests = 100;

  use(req: Request, res: Response, next: NextFunction) {
    const clientId = this.getClientId(req);
    const now = Date.now();

    if (!this.store[clientId]) {
      this.store[clientId] = {
        count: 1,
        resetTime: now + this.windowMs,
      };
    } else {
      if (now > this.store[clientId].resetTime) {
        this.store[clientId] = {
          count: 1,
          resetTime: now + this.windowMs,
        };
      } else {
        this.store[clientId].count++;

        if (this.store[clientId].count > this.maxRequests) {
          throw new HttpException(
            'Too many requests, please try again later.',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
      }
    }

    res.setHeader(
      'X-RateLimit-Limit',
      this.maxRequests.toString(),
    );
    res.setHeader(
      'X-RateLimit-Remaining',
      (this.maxRequests - this.store[clientId].count).toString(),
    );
    res.setHeader(
      'X-RateLimit-Reset',
      this.store[clientId].resetTime.toString(),
    );

    next();
  }

  private getClientId(req: Request): string {
    return req.ip || req.socket.remoteAddress || 'unknown';
  }
}
