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
import { ResetAuthDto } from './dto/reset-auth.dto';
import { SetNewPassWordDto } from './dto/reset-auth.dto';
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
        email: d.email,
        role: d.role,
      }
      const token = this.jwtService.sign(payload);
      return {
        access_token: token,
      };
    }
    else
    {
      return {
        status: 400,
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
                message: "email not found"
      };
      const my_otp = this.otp.generateOtp();
      this.email.sendEmail(email, my_otp);
      const my_uuid = uuidv4();
      this.registerRepository.setKeyInCache('reset', my_uuid, JSON.stringify({email:email, my_otp:my_otp}));
      return {
              status: 200,
              uuid: my_uuid,
              otp: my_otp,
      };
  }
  async verify_otpToEmail(family:string, dataDto: ResetAuthDto)
  {
    const data = await this.registerRepository.getKeyinCache(family, dataDto.uuid);
      
      if (data)
      {
        console.log(data);
        const parse = await JSON.parse(data);
        if (parse.my_otp == dataDto.otp)
        {
            this.registerRepository.deleteKeyInCache(family, dataDto.uuid);
            const new_uuid = uuidv4();
            this.registerRepository.setKeyInCache(family, new_uuid, JSON.stringify({email: parse.email}));
            return { 
                    status: 200,
                    message: "OTP has been validate ok",
                    uuid: new_uuid,
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
                message: "inválid OTP",        
        }
  }
  async resetPassWord(family:string, data_dto: SetNewPassWordDto): Promise<any>
  {
      const data = await this.registerRepository.getKeyinCache(family, data_dto.uuid);
      console.log(data_dto.uuid);
      if (data)
      {
        const parse = await JSON.parse(data);
        const hash_password = await bcrypt.hash(data_dto.password, 10);
        const modifiedUser = await this.registerRepository.setPassWord(parse.email, hash_password);
        if (!modifiedUser)
        return {
          status: 400,
          message: "Failed to modify password"
        };
        await this.registerRepository.deleteKeyInCache(family, data_dto.uuid);
        return {
          status: 201,
          message: "The password was modified sucessfull",
        }
      }
      
      return {
        status: 201,
      }
  }

  async getProfile(userId: string): Promise<User | null> {
    return await this.registerRepository.getUserById(userId);
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
