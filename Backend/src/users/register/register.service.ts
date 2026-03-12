import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterRepository } from '../repository/register.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { SearchUser } from '../search/search-user.service';

@Injectable()
export class RegisterService {
  constructor(
    private registerRepository: RegisterRepository,
    private jwtService: JwtService,
  ) {}

  async createUser(data: CreateUserDto): Promise<any> {
    const existingUser = await this.registerRepository.findUserByEmail(data.email);
    if (existingUser) {
      return {
        status: 400,
        message: 'The email already exist',
      };
    }

    try {
      const newUser = await this.registerRepository.createUser(data);

      const token = this.jwtService.sign({
        id: newUser.id,
        email: newUser.email,
      });

      return {
        access_token: token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      };
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  }
}
