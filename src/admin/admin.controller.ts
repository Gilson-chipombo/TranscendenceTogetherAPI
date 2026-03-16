import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {

    // constructor(private adminService: AdminService){}
    // @Get()
    // getAll(){
    //     return this.adminService.findAll();
    // }

    // @Post('create')
    // create(@Body() body){
    //     return this.adminService.create(body);
    // }

    // @Get('dashboard')
    // async dashboard() {
    //     return this.adminService.dashboardStats();
    // }
}
