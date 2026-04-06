import { Controller, Post, Body, Get, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { response, type Response } from 'express';
import { RegisterService } from './register.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { OtpDto } from '../dto/otp.dto';
import { InitUserDto } from '../dto/create-user.dto';
import { use } from 'passport';
import { UpdateAuthDto } from '../../auth/dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

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
        // otp: result.otp,
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
    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    if (result.status === 500) return {
      result,
    }
    return {
      status: 201,
      message: 'User created successfully',
      response: result,
    };
  }

  @Public()
  @Post('resend-otp')
  async resendOTP(@Body() data: any)
  {
      return await this.registerService.resendOTP(data);
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Public()
  @Post('updateUser')
  async updateUser(@CurrentUser() user: any, @Body() data: UpdateUserDto)
  {
    if (user)
    {
      return this.registerService.updateDataUser(data, user.email);
    }
    return {
      status: 400,
      message: 'user not found',
    }
  }
  // @Public()
  // @Get('users')
  // async getAllUsers() {
  //   // console.log(user);
  //   return this.searchUser.getAllUsers();
  // }
}
