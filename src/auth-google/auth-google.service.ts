import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGoogleRepository } from './repository/authgoogle.repository';

@Injectable()
export class AuthGoogleService {
  constructor(
    private readonly authGoogleRepository: AuthGoogleRepository,
    private readonly jwtService: JwtService,
  ) {}

  async loginWithGoogle(googleProfile: {
    email: string;
    name: string;
  }) {
    const user = await this.authGoogleRepository.upsertGoogleUser(googleProfile);

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
