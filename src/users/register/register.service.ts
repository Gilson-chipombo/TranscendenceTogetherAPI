import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterRepository } from '../repository/register.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { SearchUser } from '../search/search-user.service';
import { otpService } from '../otp/otp.service';
import { EmailServiceService } from '../../email-service/email-service.service';
import { RedisService } from '../../redis/redis.service';

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
    const existingUser = await this.registerRepository.findUserByEmail(data.email);
    if (existingUser) {
      return {
        status: 400,
        message: 'The email already exist',
      };
    }
    try {
      const otp = await this.otpService.generateOtp();
      this.emailService.sendEmail(data.email, otp)
      this.registerRepository.setKeyInCache('otp', data.email, otp);
      const newUser = await this.registerRepository.createUser(data);
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
}
