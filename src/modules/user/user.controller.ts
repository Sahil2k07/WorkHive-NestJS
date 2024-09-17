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
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Controller('user')
export class UserController {
  constructor(private readonly user: UserService) {}

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

    const existingUser = await this.user.findUser(email);

    if (existingUser) {
      throw new UnauthorizedException('User Already Exists');
    }

    const profilePhoto = await this.user.uploadFile(
      req.files.profilePhoto,
      'Error While uploading Profile Photo',
    );

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
      profilePhoto,
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
    const { name, email, phoneNumber, bio, skills, resumeOriginalName } =
      req.body as UpdateProfileDto;

    const skillsArray = Array.isArray(skills) ? skills : JSON.parse(skills);

    const user = await this.user.findUser(email);

    if (!user) throw new BadRequestException('User not recognized');

    let profilePhoto = user.profile.profilePhoto;
    let resume = user.profile.resume;

    if (req.files && req.files.profilePhoto) {
      profilePhoto = await this.user.uploadFile(
        req.files.profilePhoto,
        'Error Updating Profile Photo',
      );
    }

    if (req.files && req.files.resume) {
      resume = await this.user.uploadFile(
        req.files.resume,
        'Error Uploading Resume',
      );
    }

    const updatedUser = await this.user.updateUser(
      email,
      name || user.name,
      phoneNumber || user.phoneNumber,
      bio || user.profile.bio,
      skillsArray || user.profile.skills,
      profilePhoto,
      resumeOriginalName || user.profile.resumeOriginalName,
      resume,
    );

    return {
      success: true,
      message: 'User updated successfully',
      updatedUser,
    };
  }
}
