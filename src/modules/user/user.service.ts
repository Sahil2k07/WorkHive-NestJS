import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUser(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  async newUser(
    email: string,
    name: string,
    password: string,
    phoneNumber: string,
    role: Role,
    profilePhoto: string,
  ) {
    return await this.prisma.user.create({
      data: {
        email,
        password,
        name,
        phoneNumber,
        role,
        profile: {
          create: {
            profilePhoto,
            bio: 'Please provide a bio',
            resume: 'Upload a resume',
            resumeOriginalName: name,
          },
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async updateUser(
    email: string,
    name: string,
    phoneNumber: string,
    bio: string,
    skills: string[],
    profilePhoto: string,
  ) {
    return await this.prisma.user.update({
      where: { email },
      data: {
        name,
        phoneNumber,
        profile: {
          update: {
            bio,
            skills,
            profilePhoto,
          },
        },
      },
      include: { profile: true },
    });
  }
}
