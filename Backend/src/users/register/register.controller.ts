import { Controller, Post, Body, Get, Res, HttpStatus, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { RegisterService } from './register.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { SearchUser } from '../search/search-user.service';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService, private readonly searchUser: SearchUser) {}

  @Public()
  @Post()
  async signupUser(@Body() userData: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.registerService.createUser(userData);
    
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
      message: 'User created successfully',
      user: result.user,
    };
  }

  @Get('users')
  async getAllUsers() {
    return this.searchUser.getAllUsers();
  }
}
