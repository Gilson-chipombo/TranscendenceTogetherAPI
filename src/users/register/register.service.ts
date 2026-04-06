import { ConsoleLogger, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterRepository } from '../repository/register.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { otpService } from '../otp/otp.service';
import { EmailServiceService } from '../../email-service/email-service.service';
import { RedisService } from '../../redis/redis.service';
import { OtpDto } from '../dto/otp.dto';
import { InitUserDto } from '../dto/create-user.dto';
import {v4 as uuidv4} from 'uuid'
import { UpdateAuthDto } from '../../auth/dto/update-auth.dto';
import { access, openAsBlob } from 'fs';

@Injectable()
export class RegisterService {
  constructor(
    private registerRepository: RegisterRepository,
    private otpService: otpService,
    private jwtService: JwtService,
    private emailService: EmailServiceService,
    private redis: RedisService,
  ) {}

  async createUser(data: CreateUserDto): Promise<any> {
    
    // console.log(data);
    try {
      const newUser = await this.registerRepository.createUser((data));
      const token = this.jwtService.sign({
        id: newUser.id,
        email: newUser.email,
      });

      return {
        access_token: token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          firstName: newUser.firstName,
          lastName:newUser.lastName,
          country: newUser.country,
          birthDay: newUser.birthDay,
          gender: newUser.gender,
          phone: newUser.phone,
          province: newUser.province
        },
      };
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  }

  async verify_user(data: InitUserDto): Promise<any> {
    const existingUser = await this.registerRepository.findUserByEmail(data.email);
    if (existingUser) {
      return {
        status: 400,
        message: 'The email already exist',
      };
    }
    try {
      const otp = this.otpService.generateOtp();
      console.log(otp);
      await this.emailService.sendEmail(data.email, otp)
      const tmp_uuid = uuidv4();
      await this.registerRepository.setKeyInCache('signup', tmp_uuid, JSON.stringify({data, otp: otp}));
      return {
        status: 201,
        uuid: tmp_uuid,
        otp: otp,
      }
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  }
  async validateOTP(data_validade: OtpDto): Promise<any>{
    const data = await this.registerRepository.getKeyinCache('signup', data_validade.uuid);
    if (data)
    {
      const parse = JSON.parse(data);
      const userData = parse.data;
      const otp = parse.otp;
      if (data_validade.otp === otp)
      {
        await this.registerRepository.deleteKeyInCache('signup', data_validade.uuid);
        const uuid = uuidv4();
        await this.registerRepository.setKeyInCache('signup', uuid, JSON.stringify(userData));
        return {
            uuid: uuid,
        };
      }
      else
        return {status: 400, message: "invalid OTP"};
    }
  else
    return {status: 400, message: "Error in UUID"}
  }


  async fillotherFieldsTonext(data: CreateUserDto)
  {
    const tmp_data = await this.registerRepository.getKeyinCache('signup', data.uuid);
    console.log(tmp_data);
    if (tmp_data)
    {
      const parse = JSON.parse(tmp_data);
      data.email = parse.email;
      data.password = parse.password;
      // console.log(data);
      const user =  await this.createUser(data);
      if (user)
      {
        const pyload = {
          id: user.id,
          role: user.role,
        }
        const pyload_refresh_token = {
          id: user.id,
          role: user.role,
          type: "refresh",
        }
        const token  = this.jwtService.sign(pyload, {expiresIn: "15m"});
        const refresh_token = this.jwtService.sign(pyload_refresh_token, {expiresIn: '7d'});
        return {
            id: user.id,
            access_token : token,
            refresh_token: refresh_token,
        }
      }
    }
    return { 
          status: 400,
          message: 'Invalid UUID, please retry the process',
    }
  }

  async resendOTP(uuid: string): Promise<any>
  {
    const data = await this.registerRepository.getKeyinCache('signup', uuid);
    if (data)
    {
      const parse = JSON.parse(data);
      const userData = parse.data;
      const otp = this.otpService.generateOtp();
      await this.emailService.sendEmail(userData.email, otp);
      const new_uuid = uuidv4();
      await this.registerRepository.deleteKeyInCache('signup', uuid);
      await this.registerRepository.setKeyInCache('signup', new_uuid, JSON.stringify({data: userData, otp: otp}));
      return {
        status: 201,
        message: 'OTP resent successfully',
        response: {
          uuid: new_uuid,
          otp: otp,
        }
      }
    }
    return {
      status: 400,
      message: 'Invalid UUID',
    }
  }

  async updateDataUser(data: UpdateAuthDto, email: string): Promise<any>
  {
   return await this.registerRepository.updateUser(data, email);
  }
}


