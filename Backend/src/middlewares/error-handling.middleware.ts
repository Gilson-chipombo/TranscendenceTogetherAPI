import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorHandlingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('ErrorHandling');

  use(req: Request, res: Response, next: NextFunction) {
    const originalSend = res.send;

    res.send = function (data: any) {
      if (res.statusCode >= 400) {
        const logData = {
          method: req.method,
          url: req.url,
          status: res.statusCode,
          timestamp: new Date().toISOString(),
        };

        if (res.statusCode >= 500) {
          this.logger.error(`Error: ${JSON.stringify(logData)}`, data);
        } else {
          this.logger.warn(`Warning: ${JSON.stringify(logData)}`);
        }
      }

      return originalSend.call(this, data);
    };

    next();
  }
}
