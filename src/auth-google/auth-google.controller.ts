import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthGoogleService } from './auth-google.service';
import { UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../auth/decorators/public.decorator';

@Controller('auth/google')
export class AuthGoogleController {
  constructor(private readonly authGoogleService: AuthGoogleService) {}

  @Public()
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return;
  }

  @Public()
  @Get('callback')
  @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
      const result = await this.authGoogleService.loginWithGoogle(req.user);
      res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const redirectUrl = `${process.env.FRONTEND_URL}#access_token=${result.access_token}`;
    return res.redirect(redirectUrl);
  }
}
