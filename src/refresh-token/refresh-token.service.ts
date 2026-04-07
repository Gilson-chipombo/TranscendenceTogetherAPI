import { Injectable } from '@nestjs/common';
import { RegisterRepository } from '../users/repository/register.repository';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenService {
    constructor(private readonly registerRepository: RegisterRepository, private jwtService: JwtService){}
    async refreshToken(data: RefreshTokenDto){

      const data_tmp = await this.jwtService.verify(data.refresh_token, {secret: process.env.REFRESH_TOKEN});
      if(!data_tmp || data_tmp.type !== 'refresh')
      {
        throw new Error('Invalid refresh token');
      }
      const data_user = await this.registerRepository.getUserById(data_tmp.id);
      if (!data_user) {
        throw new Error('User not found');
      }

      const payload_refresh = {
      id: data_user.id,
      role: data_user.role,
      type: 'refresh',
      }
      const payload_token = {
        id: data_user.id,
        role: data_user.role,
        type: 'access',
      }
        const new_Refresh_token = this.jwtService.sign(payload_refresh, {secret: process.env.REFRESH_TOKEN, expiresIn: '7d'})
        const new_token = this.jwtService.sign(payload_token, {secret: process.env.JWT_SECRET, expiresIn: '15m'})
        await this.registerRepository.updateRefreshToken(data.refresh_token, new_Refresh_token, data_user.id);
        return {
            acess_token: new_token,
            refresh_token: new_Refresh_token
        }
    }
}
