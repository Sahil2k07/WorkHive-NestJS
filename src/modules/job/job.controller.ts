import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JobService } from './job.service';
import type { Request } from 'express';
import { ZodPipe } from 'src/pipe/ZodPipe.pipe';
import { type PostJobDto, postJobSchema } from 'src/dto/job.dto';

@Controller('job')
export class JobController {
  constructor(private readonly job: JobService) {}

  @Post('post-job')
  @UsePipes(new ZodPipe(postJobSchema))
  async postJob(@Req() req: Request) {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body as PostJobDto;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      throw new BadRequestException('All Fields Required');
    }

    if (req.user.role !== 'Recruiter')
      throw new UnauthorizedException('Recruiters only Route');

    const userId = req.user.id;

    const job = await this.job.createJob(
      userId,
      title,
      description,
      requirements,
      Number(salary),
      location,
      jobType,
      Number(experience),
      Number(position),
      companyId,
    );

    return {
      success: true,
      message: 'Job Created Successfully',
      job,
    };
  }

  @Get('get-jobs')
  async getAllJobs(@Query('keyword') keyword?: string) {
    if (keyword) {
      const jobs = await this.job.getJobs(keyword);

      return {
        success: true,
        message: 'Got all Jobs successfully',
        jobs,
      };
    }

    const jobs = await this.job.getJobs();

    return {
      success: true,
      message: 'Got all Jobs Successfully',
      jobs,
    };
  }

  @Get('get-job/:id')
  async getJob(@Param('id') id: string) {
    const job = await this.job.getJob(id);

    if (!job) throw new NotFoundException('Job not found');

    return {
      success: true,
      message: 'Got Job data successfully',
      job,
    };
  }

  @Get('user-jobs')
  async userJobs(@Req() req: Request) {
    const { id } = req.user;

    if (!id) throw new UnauthorizedException('Invalid user Request');

    const jobs = await this.job.userJobs(id);

    return {
      success: true,
      message: 'Got User created Jobs Successfully',
      jobs,
    };
  }
}
