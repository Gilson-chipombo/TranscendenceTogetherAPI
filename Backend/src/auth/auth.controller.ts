import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() createAuthDto: CreateAuthDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.getlogin(createAuthDto);
    
    if (result.statusCode === 400) {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }

    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Login successful',
      user: result.user,
    };
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
