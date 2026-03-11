import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repository/users.repository';

@Injectable()
export class UserService {
    constructor(private repository: UsersRepository){}

    createUser(data) {
        return this.repository.create(data);
    }

    findByEmail(email: string) {
        return this.repository.findByEmail(email);
    }

    findAll() {
        return this.repository.findAll();
    }
}
