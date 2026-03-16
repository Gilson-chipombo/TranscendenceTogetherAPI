import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as zlib from 'zlib';

@Injectable()
export class CompressionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const acceptEncoding = req.headers['accept-encoding'] || '';

    if (acceptEncoding.includes('gzip')) {
      const originalJson = res.json;

      res.json = function (data: any) {
        res.setHeader('Content-Encoding', 'gzip');
        
        const json = JSON.stringify(data);
        zlib.gzip(json, (err, compressed) => {
          if (err) {
            res.status(500).send('Compression error');
            return;
          }
          res.setHeader('Content-Length', Buffer.byteLength(compressed));
          res.end(compressed);
        });

        return res;
      };
    }

    next();
  }
}
