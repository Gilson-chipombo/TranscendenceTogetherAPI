import { Injectable } from '@nestjs/common';
import { RegisterRepository } from '../users/repository/register.repository';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';

@Injectable()
export class RefreshTokenService {
    constructor(private readonly registerRepository: RegisterRepository, private jwtService: JwtService, private authService: AuthService){}
    async refreshToken(data: RefreshTokenDto){


        // const token_crypted = await bcrypt.hash(data.refresh_token, 10);
        const key = await this.registerRepository.getKeyinCache('refresh_token', data.refresh_token);
        if (!key)
        {
          console.log("Invalid refresh token: " + data.refresh_token);
          return {
            status: 500
          }
        }
        const user = this.jwtService.verify(data.refresh_token, {secret: process.env.REFRESH_TOKEN});
        if (user)
        {
          const data_new_login = await this.authService.generateJwt(user);
          await this.registerRepository.updateRefreshToken(data.refresh_token, data_new_login.refresh_token, user.id);
          return {
              access_token: data_new_login.access_token,
              refresh_token: data_new_login.refresh_token,
              }
        }
    }
}
