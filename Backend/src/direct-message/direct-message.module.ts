import { Module } from '@nestjs/common';
import { DirectMessageService } from './direct-message.service';
import { DirectMessageController } from './direct-message.controller';
import { DmGateway } from './gateway/dm.gateway';
import { DmRepository } from './repository/dm.repository';

@Module({
  providers: [DirectMessageService, DmGateway, DmRepository],
  controllers: [DirectMessageController]
})
export class DirectMessageModule {}
