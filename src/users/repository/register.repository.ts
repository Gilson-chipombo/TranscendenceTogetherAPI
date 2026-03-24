import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RedisService } from '../../redis/redis.service';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class RegisterRepository {
  constructor(private prisma: PrismaService, private redis: RedisService) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }
  async createUser(data: CreateUserDto): Promise<User> {
    // console.log(data);
    const hashedPassword = await bcrypt.hash(data.password, 10);
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
  async getKeyinCache(family: string, key: string): Promise<any> {
    const full_key = `${family}:${key}`;
    return await this.redis.get(full_key);
  }
  async setKeyInCache(family:string, key: string, value: string): Promise<void>
  {
    const full_key = `${family}:${key}`;
    await this.redis.set(full_key, value, "EX", 60 * 60 * 24);
  }
  async deleteKeyInCache(family:string, key: string): Promise<void>
  {
    const full_key = `${family}:${key}`;
    await this.redis.del(full_key);
  }

  async setPassWord(email:string, new_pw:string)
  {
      this.prisma.user.update({
        where: {email :email},
        data: {
          password: new_pw,
        }
      })
  }
}
