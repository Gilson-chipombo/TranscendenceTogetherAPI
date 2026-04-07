import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Req } from '@nestjs/common';
import { response, type Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { Public } from './decorators/public.decorator';
import { ResetAuthDto } from './dto/reset-auth.dto';
import { SetNewPassWordDto } from './dto/reset-auth.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { PassThrough } from 'node:stream';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() createAuthDto: CreateAuthDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.getlogin(createAuthDto);
    
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

    return {
      status: 201,
      message: 'Login successful',
      response: result,
    };
  }
  @Public()
  @Post('forgot-password')
  async sendToCheckEmail(@Body() data_email: any)
  {
    return await this.authService.resetEmail(data_email.email);
  }
  @Public()
  @Post('verify-otp')
  async verify_OTP(@Body() data: ResetAuthDto, @Res({ passthrough: true }) res: Response)
  {
    const response = await this.authService.verify_otpToEmail('reset',data);
    if (response.status === 400)
    {
      res.status(HttpStatus.BAD_REQUEST).json(response);
      return ;
    }
    return {
      status: 200,
      message: 'OTP verified successfully',
      response: response.Response,
    }
  }

  @Public()
  @Post('reset-password')
  async resetPassord(@Body() data:SetNewPassWordDto, @Res( {passthrough: true} ) res: any)
  {
      const response =  await this.authService.resetPassWord('reset', data);
      if (response.status === 400)
      {
        res.status(HttpStatus.BAD_REQUEST).json(response);
        return ;
      }
      return {
        status: 200,
        message: 'Password reset successfully',
  }
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    const refreshToken = res.cookie['refresh_token'];
    if (refreshToken)
    {
      
    }
    res.clearCookie('refresh_token');
    return { 
      status: 200,
      message: 'Logout successful',
    };
  }

  @Get('id/:id')
  async findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.id);
  }

  @Get('users')
  async getAllUsers(@CurrentUser() user: any) {
    // console.log(user);
    return await this.authService.findAll(String(user.id));
  }

  // @Patch('id/:id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete('id/:id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
