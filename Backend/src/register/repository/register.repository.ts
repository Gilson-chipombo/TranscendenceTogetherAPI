import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterRepository {
  constructor(private prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    console.log("Creating user with email: " + data.email);
    return this.prisma.user.create({
      data: {
        name: data.email.split('@')[0], 
        email: data.email,
        password: hashedPassword,
      },
    });
  }


  async getAllUsers() {
    return this.prisma.user.findMany({
      select: { name: true },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: String(id) },
    });
  }
}
