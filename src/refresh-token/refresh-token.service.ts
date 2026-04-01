import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service'
import { RegisterRepository } from '../users/repository/register.repository';

@Injectable()
export class RefreshTokenService {
    constructor(){}
}
