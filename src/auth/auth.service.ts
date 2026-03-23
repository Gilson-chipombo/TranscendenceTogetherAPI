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
import { otpService } from '../users/otp/otp.service';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import {v4 as uuidv4} from 'uuid'

@Injectable()
export class AuthService {
  constructor(
    private readonly registerRepository: RegisterRepository,
    private readonly jwtService: JwtService,
    private readonly otp: otpService,
    // private prisma : PrismaService,
    private email : EmailServiceService,
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
        return { 
                status: 401,
                message: "email not founded"
      };
      const my_otp = this.otp.generateOtp();
      this.email.sendEmail(email, my_otp);
      const my_uuid = uuidv4();
      this.registerRepository.setKeyInCache('reset', my_uuid, JSON.stringify({email, my_otp}));
      return {
              status: 200,
              temporary_id: my_uuid
      };
  }
  async verify_otpToEmail(family:string, key:string, otp:string)
  {
      const data = await this.registerRepository.getKeyinCache(family, key);
      if (data)
      {
        const parse = await JSON.parse(data);
        if (data.my_opt == otp)
        {
            this.registerRepository.deleteKeyInCache(family, key);
            const new_uuid = uuidv4();
            this.registerRepository.setKeyInCache(family, new_uuid, data.email);
            return { 
                    status: 200,
                    message: "OTP has been validate ok",
                    temporary_id: new_uuid,
            }
        }
        else
          return {
                  status: 400,
                  message: "inválid OTP"
          }
      }
      else
        return {
                status: 400,
                message: "OTP is expires",        
        }
  }
  async resetPassWord(family:string, key:string, data_dto: UpdateUserDto): Promise<any>
  {
      const data = this.registerRepository.getKeyinCache(family, key);
      if (data)
      {
        const hash_password = await bcrypt.hash(data_dto.password, 10);
        this.registerRepository.setPassWord(data_dto.email, hash_password);
      }
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
