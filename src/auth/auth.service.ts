import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service'
import { RegisterRepository } from '../users/repository/register.repository';

import { EmailServiceService } from '../email-service/email-service.service';
import * as bcrypt from 'bcrypt';
import { Auth } from './entities/auth.entity';
import { ResetEmail } from '../users/otp/templates/reset-pw-template';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerRepository: RegisterRepository,
    private readonly jwtService: JwtService,
    // private prisma : PrismaService,
    // private serviceEmail : EmailServiceService,
  ) {}
  
  async getlogin(createAuthDto: CreateAuthDto){
    const d = await this.registerRepository.findUserByEmail(createAuthDto.email);
    const passwordMatch = d ? await bcrypt.compare(createAuthDto.password, d.password || 'google-auth') : false;
    
    if ((d) && passwordMatch)    
    {
      console.log("Login successful for email: " + createAuthDto.email);
      const payload = {
        id: d.id,
        email: d.email
      }
      const token = this.jwtService.sign(payload);
      return {
        access_token: token,
        user: {
          id: d.id,
          email: d.email,
          name: d.name,
        }
      };
    }
    else
    {
      return {
        statusCode: 400,
        message: "email or password incorrect",
        };
    }
  }

  async resetEmail(email: string)
  {
      const find_email = this.registerRepository.getUserByEmail(email);
      if (!find_email)
        return null;
  }
  
  findAll() {
    return Auth;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
