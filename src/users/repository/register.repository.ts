import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RedisService } from '../../redis/redis.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InitUserDto } from '../dto/create-user.dto';

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
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
          email: data.email,
          name: data.name,
          firstName: data.firstName,
          lastName:data.lastName,
          country: data.country,
          birthDay: data.birthDay,
          gender: data.gender,
          phone: data.phone,
          province: data.province,
          password: hashedPassword,
      },
    });
  }

  async getAllUsers(currentUser: string) {
    return this.prisma.user.findMany({
      where:{
          id: {
              not: currentUser, 
          }
      },
      select: { name: true, id: true },
    });
  }

  async getUserById(id: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
       name   : true,
       email    : true,
       password   : false,
       googleID   : false,
       firstName    : true,
       lastName   : true,
       birthDay   : true,
       country    : true,
       photo    : true,
       phone    : true,
       province   : true,
       gender   : true,
       role   : true,
       block    : true,
       createdAt    : true,
       updateAt   : true,
       rooms    : false,
       config   : true,
       messages   : false,
       roomMember   : false,
       _count: false,
      },
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

  async updateUser(data: UpdateUserDto, email: string): Promise<any>
  {
    const {password, ...updateData} = data;
    const upDateInput: Prisma.UserUpdateInput = { ...updateData };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      upDateInput.password = hashedPassword;
    }
    return await this.prisma.user.update({
      where: { email: email },
      data: upDateInput,
    });
  }

  async getKeyinCache(family: string, key: string): Promise<any> {
    const full_key = `${family}:${key}`;
    return await this.redis.get(full_key);
  }
  async setKeyInCache(family:string, key: string, value: string): Promise<void>
  {
    const full_key = `${family}:${key}`;
    await this.redis.set(full_key, value, "EX", 60 * 60 * 5);
  }
  async deleteKeyInCache(family:string, key: string): Promise<void>
  {
    const full_key = `${family}:${key}`;
    await this.redis.del(full_key);
  }

  async setPassWord(email:string, new_pw:string)
  {
      return await this.prisma.user.update({
        where: {email :email},
        data: {
          password: new_pw,
        }
      })
  }

  async registerRefreshToken(id:string, refresh_token: string) {
    
      const res = await this.redis.set("refreshToken:" + refresh_token, id, "EX", 60 * 60 * 24 * 7);
      if (res)
        return {
            status: 201,
            message: 'refresh token created sucessful'
        }
      return {
            status: 500,
            message: 'Error in create refresh token',
      }
  }

  async deleteRefreshToken(refresh_token: string)
  {
    // const tokenInCache = bcrypt.compare(refresh_token, 10);
    return await this.redis.del("refreshToken:" + refresh_token);
  }

  async updateRefreshToken(refresh_token: string, new_refresh_token: string, id: string) {
    this.deleteRefreshToken(refresh_token);
    return await this.registerRefreshToken(id, new_refresh_token);
  }
}
