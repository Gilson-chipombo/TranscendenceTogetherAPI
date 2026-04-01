import { Injectable } from '@nestjs/common';
import { RegisterRepository } from '../users/repository/register.repository';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenService {
    constructor(private readonly registerRepository: RegisterRepository, private jwtService: JwtService){}
    async refreshToken(data: RefreshTokenDto){

        const payload_refresh = {
        id: data.id,
        type: 'refresh',
      }
      const payload_token = {
        id: data.id,
        role: data.role,
        type: 'access',
      }
        const new_Refresh_token = this.jwtService.sign(payload_refresh, {expiresIn: '7d'})
        const new_token = this.jwtService.sign(payload_token, {expiresIn: '15m'})
        await this.registerRepository.updateRefreshToken(data.refresh_token, new_Refresh_token, data.id);
        return {
            acess_token: new_token,
            refresh_token: new_Refresh_token
        }
    }
}
