import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor() {
    super(process.env.REDIS_URL, {
      tls: {
        rejectUnauthorized: false,
      },
      maxRetriesPerRequest: 3,
    });
  }

  async onModuleInit() {
    this.on('connect', () => {
      this.logger.log('Redis connected successfully');
    });

    this.on('error', (err) => {
      this.logger.error('Redis connection error ', err);
    });
  }

  async onModuleDestroy() {
    await this.quit();
  }
}