import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CloudinaryService } from 'src/config/cloudinary.service';
import { PrismaService } from 'src/config/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

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
    resumeOriginalName: string,
    resume: string,
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
            resumeOriginalName,
            resume,
          },
        },
      },
      include: { profile: true },
    });
  }

  async uploadFile(file: File, errorMessage: string) {
    const media = Array.isArray(file) ? file[0] : file;

    try {
      const cloudResponse = await this.cloudinary.Uploader(
        media,
        process.env.FOLDER_NAME,
      );

      return cloudResponse.secure_url;
    } catch (e) {
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
