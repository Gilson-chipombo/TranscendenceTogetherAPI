import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';


export interface LoginResponse {
    access_token: string;
    idUser: number;
    userType: string;
    state?: string;
}

@Controller('auth')
export class AuthController {
    // constructor(private authService: AuthService){}

    // @Post('student/login')
    // async loginStudent(@Body() body){
    //     const student = await this.authService.validateStudent(
    //         body.email,
    //         body.password,
    //     );

    //     if (!student) 
    //         return {"message": "Student credenciais inválidas ou estudante ainda não aprovado"};
        
    //     return this.authService.login(student, "Student");
    // }

    // @Post('company/login')
    // async loginCompany(@Body() body){
    //     const company = await this.authService.validateCompany(
    //         body.email,
    //         body.password
    //     )

    //     if (!company)
    //         return {"message": "Company credenciais inválidas ou empresa ainda  não aprovada    "};
    //     return this.authService.login(company, "Company");
    // }

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
