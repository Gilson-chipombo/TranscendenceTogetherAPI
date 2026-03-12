import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { UsersRepository } from './repository/users.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaModule,],
  controllers: [UsersController],
  providers: [UserService, UsersRepository, PrismaService]
})
export class UserModule {}
