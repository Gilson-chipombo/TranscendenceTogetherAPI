import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterRepository } from '../users/repository/register.repository';
import { AuthGoogleRepository } from './repository/authgoogle.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthGoogleService {
  constructor(
    private readonly authGoogleRepository: AuthGoogleRepository,
    private readonly jwtService: JwtService,
    private readonly registerRepository: RegisterRepository,
  ) {}

  async loginWithGoogle(googleProfile: {
    email: string;
    firstName: string;
    lastName: string;
  }) {
    const user = await this.authGoogleRepository.upsertGoogleUser(googleProfile);

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });
    const refreshToken = this.jwtService.sign({
      id: user.id,
      type: 'refresh',
    }, { expiresIn: '7d' });
    await this.registerRepository.setKeyInCache('refresh_token', refreshToken, JSON.stringify({userId: user.id}));

    const token_cripted = await bcrypt.hash(refreshToken, 10);
    return {
      status: 201,
      access_token: token,
      refresh_token: token_cripted,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
