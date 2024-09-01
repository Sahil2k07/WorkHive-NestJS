import {
  Req,
  Controller,
  Post,
  UsePipes,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  HttpCode,
  Res,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  type SignupDto,
  signupSchema,
  type LoginDto,
  loginSchema,
  updateProfileSchema,
  type UpdateProfileDto,
} from 'src/dto/user.dto';
import { ZodPipe } from 'src/pipe/ZodPipe.pipe';
import type { Request, Response } from 'express';
import { CloudinaryService } from 'src/config/cloudinary.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Controller('user')
export class UserController {
  constructor(
    private readonly user: UserService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  @Post('signup')
  @UsePipes(new ZodPipe(signupSchema))
  async signup(@Req() req: Request) {
    const { email, name, password, phoneNumber, role } = req.body as SignupDto;

    if (!name || !email || !phoneNumber || !password || !role) {
      throw new BadRequestException('All Fields required');
    }

    if (!req.files || !req.files.profilePhoto) {
      throw new BadRequestException('Upload a Profile Photo');
    }

    const profilePhoto = Array.isArray(req.files.profilePhoto)
      ? req.files.profilePhoto[0]
      : req.files.profilePhoto;

    const existingUser = await this.user.findUser(email);

    if (existingUser) {
      return {
        success: false,
        message: 'User already exists',
      };
    }

    const cloudResponse = await this.cloudinary.Uploader(
      profilePhoto,
      process.env.FOLDER_NAME,
    );

    if (!cloudResponse) {
      throw new InternalServerErrorException(
        'Unable to upload your Profile Photo',
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_ROUNDS)!,
    );

    const user = await this.user.newUser(
      email,
      name,
      hashedPassword,
      phoneNumber,
      role,
      cloudResponse.secure_url,
    );

    return {
      success: true,
      message: 'User created successfully',
      user,
    };
  }

  @Post('login')
  @HttpCode(200)
  @UsePipes(new ZodPipe(loginSchema))
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { email, password, role } = req.body as LoginDto;

    if (!email || !password || !role)
      throw new UnauthorizedException('All fields Required');

    const user = await this.user.findUser(email);

    if (!user) throw new UnauthorizedException('User does not exist');

    if (!bcrypt.compare(password, user.password))
      throw new UnauthorizedException('Wrong Password');

    if (role !== user.role)
      throw new UnauthorizedException('User cant be recognized by their role');

    const tokenData = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });

    res.cookie('token', token, { maxAge: 3 * 24 * 60 * 60 * 1000 });

    req.user = tokenData;

    return {
      success: true,
      message: 'User Logged In successfully',
      user,
      token,
    };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.cookie('token', null);

    req.user = null;

    return {
      success: true,
      message: 'Logged Out successfully',
    };
  }

  @Put('update-profile')
  @HttpCode(200)
  @UsePipes(new ZodPipe(updateProfileSchema))
  async updateProfile(@Req() req: Request) {
    const { name, email, phoneNumber, bio, skills } =
      req.body as UpdateProfileDto;

    const user = await this.user.findUser(email);

    if (!user) throw new BadRequestException('User not recognized');

    let profilePhoto = user.profile.profilePhoto;

    if (req.files && req.files.profilePhoto) {
      try {
        const picture = Array.isArray(req.files.profilePhoto)
          ? req.files.profilePhoto[0]
          : req.files.profilePhoto;

        const cloudResponse = await this.cloudinary.Uploader(
          picture,
          process.env.FOLDER_NAME,
        );

        profilePhoto = cloudResponse.secure_url;
      } catch (error) {
        throw new InternalServerErrorException(
          'Error while Updating Profile Photo',
        );
      }
    }

    const updatedUser = await this.user.updateUser(
      email,
      name || user.name,
      phoneNumber || user.phoneNumber,
      bio || user.profile.bio,
      skills || user.profile.skills,
      profilePhoto,
    );

    return {
      success: true,
      message: 'User updated successfully',
      updatedUser,
    };
  }
}
