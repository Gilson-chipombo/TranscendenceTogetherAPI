import { Controller, Body, Post , Res} from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { response, Response } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import { JwtService } from '@nestjs/jwt';
// import { }

@Controller('refresh-token')
export class RefreshTokenController {
    constructor(private tokenService: RefreshTokenService){}

    @Public()
    @Post()
    async refreshToken(@Body() data: RefreshTokenDto, @Res({passthrough: true}) res: Response)
    {
        const result = await this.tokenService.refreshToken(data);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        res.cookie('refresh_token', result.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return {
            status: 201,
            message: 'create new acess-token sucessfull',
            response: result,
        }
    }
}

