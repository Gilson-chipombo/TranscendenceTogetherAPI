import { Controller, Post, Body, Get, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { response, type Response } from 'express';
import { RegisterService } from './register.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { OtpDto } from '../dto/otp.dto';
import { SearchUser } from '../search/search-user.service';
import { InitUserDto } from '../dto/create-user.dto';
import { use } from 'passport';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService, private readonly searchUser: SearchUser) {}

  @Public()
  @Post()
  async signupUser(@Body() userData: InitUserDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.registerService.verify_user(userData);
    
    if (result.status === 400) {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }
    return {
      status: result.status,
      message: result.message,
      response: {
        uuid: result.uuid,
        otp: result.otp,
      }
    };
  }

  @Public()
  @Post('validate-user')
  async validade_user(@Body() userData: OtpDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.registerService.validateOTP(userData);
    
    if (result.status === 400) {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }

    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      status: 201,
      message: 'OTP validated successfully',
      response: result,
    };
  }

  @Public()
  @Post('signup')
  async signup(@Body() userData: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.registerService.fillotherFieldsTonext(userData);
    
    if (result.status === 400) {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }

    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      status: 201,
      message: 'User created successfully',
      response: result,
    };
  }
  // @Post('updateUser')
  // @Get('users')
  // async getAllUsers() {
  //   return this.searchUser.getAllUsers();
  // }
}
