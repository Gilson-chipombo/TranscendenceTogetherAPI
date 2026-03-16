import { Module } from '@nestjs/common';
import { EmailServiceController } from './email-service.controller';
import { EmailServiceService } from './email-service.service';

@Module({
  controllers: [EmailServiceController],
  providers: [EmailServiceService]
})
export class EmailServiceModule {}
