import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Req } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { Public } from './decorators/public.decorator';
import { ResetAuthDto } from './dto/reset-auth.dto';
import { SetNewPassWordDto } from './dto/reset-auth.dto';

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

    return {
      status: res.status,
      message: 'Login successful',
      response: {
        access_token: result.access_token,
      }
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
  async verify_OTP(@Body() data: ResetAuthDto)
  {
    // console.log(req.headers);
    // console.log(req.body)
    return await this.authService.verify_otpToEmail('reset',data);
  }

  @Public()
  @Post('reset-password')
  async resetPassord(@Body() data:SetNewPassWordDto)
  {
      return await this.authService.resetPassWord('reset', data);
  }

  @Public()
  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logout successful' };
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch('id/:id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete('id/:id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
