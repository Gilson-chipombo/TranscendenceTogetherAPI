import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmailServiceService } from './email-service.service';


@Controller('email')
export class EmailServiceController {
  constructor(private readonly emailServiceService: EmailServiceService) {}

  @Get()
  findAll() {
    return this.emailServiceService.sendEmail();
  }
}
