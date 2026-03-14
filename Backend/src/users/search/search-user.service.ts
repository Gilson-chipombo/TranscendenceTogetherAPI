import { Inject, Injectable } from "@nestjs/common";
import { RegisterModule } from "../register/register.module";
import { RegisterRepository } from "../repository/register.repository";

@Injectable()
export class SearchUser { 
    constructor(private readonly repository: RegisterRepository){}
    async getAllUsers(): Promise<any> {
        return this.repository.getAllUsers();
    }

    async getUserById(id: string): Promise<any> {
        return this.repository.getUserById(id);
    }
    async getOneUser(name:string): Promise<any>{
        return this.repository.getOneUserByname(name);
    }
}