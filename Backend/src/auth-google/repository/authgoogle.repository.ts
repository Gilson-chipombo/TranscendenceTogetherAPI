import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthGoogleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertGoogleUser(profile: {
    email: string;
    name: string;
  }): Promise<User> {
    const { email, name } = profile;

    if (!email) {
      throw new BadRequestException('Google account did not return an email');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name,
        },
      });
    }

    return this.prisma.user.create({
      data: {
        email,
        name,
        password: 'google-oauth',
      },
    });
  }
}
