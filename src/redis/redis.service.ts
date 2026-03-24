import { RedisCache } from "cache-manager-redis-yet"
import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from "@nestjs/common"
import Redis from 'ioredis'

@Injectable()
export class RedisService extends Redis implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    // constructor(){
    //     super({
    //             host: process.env.HOST_REDIS_REMOTE,
    //             password: process.env.REDISPASS,
    //             port: Number(process.env.PORT_REDIS),
    //             username: process.env.USER_REDIS,
    //             tls: process.env.NODE_ENV === 'production' ? {} : null,
    //             maxRetriesPerRequest: null,
    //         })
    //     }
      constructor() {
        super(process.env.REDIS_URL);
      }

    async onModuleInit(){
        this.on('connect', () =>{
            this.logger.log("Resdis conected sucessiful");
        });
        this.on('error', () => {
            this.logger.log("Redis conection Error");
        });
    }
    async onModuleDestroy(){
        await this.quit();
    }
}

