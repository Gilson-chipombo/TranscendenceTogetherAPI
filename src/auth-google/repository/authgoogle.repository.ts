import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';


export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

@Injectable()
export class AuthGoogleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertGoogleUser(profile: {
    email: string;
    firstName?: string;
    lastName?: string;
    birthDay?: string;
    gender?: Gender;
  }): Promise<any> {
    const { email, firstName, lastName, birthDay, gender } = profile;

    if (!email) {
      throw new BadRequestException('Google account did not return an email');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        email: existingUser.email,
        name: existingUser.name,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        id: existingUser.id,
        birthDay: existingUser.birthDay,
        gender: existingUser.gender
      }
    }

    return this.prisma.user.create({
      data: {
        email,
        name: email.split('@')[0],
        firstName,
        lastName,
        birthDay,
        gender: gender ? Gender[gender.toUpperCase()] : null,
      },
    });
  }
}
