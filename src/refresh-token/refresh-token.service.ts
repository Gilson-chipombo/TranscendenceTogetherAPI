import { Injectable } from '@nestjs/common';
import { RegisterRepository } from '../users/repository/register.repository';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';

@Injectable()
export class RefreshTokenService {
    constructor(private readonly registerRepository: RegisterRepository, private jwtService: JwtService, private authService: AuthService){}
    async refreshToken(data: RefreshTokenDto){


        const key = await this.registerRepository.getKeyinCache('refresh_token', data.refresh_token);
        if (!key)
        {
          return {
            status: 500,
            // message: 'Bad refresh token',
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
