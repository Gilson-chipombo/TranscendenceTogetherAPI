import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './repository/auth.repository';

@Injectable()
export class AuthService {
    constructor( private repository: AuthRepository, 
                 private jwtService: JwtService,
    ){}


    async validateUser(email: string, password: string) {
        const user = await this.repository.findUserByEmail(email);

        if (!user)
        throw new UnauthorizedException();

        const valid = await bcrypt.compare(password, user.password);

        if (!valid)
        throw new UnauthorizedException();

        //return user;

        const payload = {sub: user.id, email: user.email};
        const idUser = user.id;
        return {
            access_token: this.jwtService.sign(payload),
            idUser,
        };

  }


    // async login(user: any, userType: string) {
    //     const payload = {sub: user.id, email: user.email};
    //     const idUser = user.id;
    //     return {
    //         access_token: this.jwtService.sign(payload),
    //         idUser,
    //         userType
    //     };
    // }
}
