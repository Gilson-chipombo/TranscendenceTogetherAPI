import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';


export interface LoginResponse {
    access_token: string;
    idUser: number;
    userType: string;
    state?: string;
}

@Controller('auth')
export class AuthController {
    // constructor(private authService: AuthService){}

   constructor(private service: AuthService) {}

    @Post("login")
    login(@Body() dto: LoginDto) {
        return this.service.validateUser(dto.email, dto.password);
    }


    // @Post('admin/login')
    // async loginAdmin(@Body() body){
    //     const admin = await this.authService.validateAdmin(
    //         body.email,
    //         body.password
    //     )

    //     if (!admin)
    //         return {"message": "Company credenciais inválidas"};
    //     return this.authService.login(admin, "Admin");
    // }
}
