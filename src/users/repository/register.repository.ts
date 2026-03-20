import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterRepository {
  constructor(private prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
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
        name: data.name, 
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDay: data.birthDay,
        country: data.country,
        photo: data.photo,
        phone: data.phone,
        province: data.province,
        gender: data.gender,
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

  async getOneUserByname(name: string): Promise<any>
  {
      const user_finded = await this.prisma.user.findFirst({
        where : {
        name: String(name)},
      })

      if (!user_finded)
        return null;
      return user_finded.name;
  }
  async getUserByEmail(email: string): Promise<any>
  {
    const email_user = await this.prisma.user.findUnique({where: {email: email}});
    if (email_user)
      return email_user.email;
    return null;
  }
}
