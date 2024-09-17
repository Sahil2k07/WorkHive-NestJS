import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JobService } from './job.service';
import type { Request } from 'express';
import { ZodPipe } from 'src/pipe/ZodPipe.pipe';
import {
  type PostJobDto,
  postJobSchema,
  type UpdateJobDto,
  updateJobSchema,
} from 'src/dto/job.dto';

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

    const requirementsArray = Array.isArray(requirements)
      ? requirements
      : JSON.parse(requirements);

    if (req.user.role !== 'Recruiter')
      throw new UnauthorizedException('Recruiters only Route');

    const existingJob = await this.job.checkJob(title, location, companyId);

    if (existingJob)
      throw new BadRequestException('You have posted Similar job Recently');

    const userId = req.user.id;

    const job = await this.job.createJob(
      userId,
      title,
      description,
      requirementsArray,
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
    const { id, role } = req.user;

    if (!id || !role) throw new UnauthorizedException('Invalid user Request');

    if (role !== 'Recruiter')
      throw new UnauthorizedException('Recruiters only Route');

    const jobs = await this.job.userJobs(id);

    return {
      success: true,
      message: 'Got User created Jobs Successfully',
      jobs,
    };
  }

  @Put('update-job/:id')
  @UsePipes(new ZodPipe(updateJobSchema))
  async updateJob(@Req() req: Request) {
    const { id } = req.params;

    if (!id) throw new BadRequestException('JobId details Required');

    if (!req.user || req.user.role !== 'Recruiter')
      throw new UnauthorizedException('Recruiter only Route');

    const {
      title,
      requirements,
      description,
      salary,
      location,
      jobType,
      position,
      experienceLevel,
    } = req.body as UpdateJobDto;

    if (
      !title ||
      !requirements ||
      !description ||
      !salary ||
      !location ||
      !jobType ||
      !position ||
      !experienceLevel
    )
      throw new BadRequestException('Required Fields Missing');

    const requirementsArray = Array.isArray(requirements)
      ? requirements
      : JSON.parse(requirements);

    const existingJob = await this.job.getJob(id);

    if (!existingJob) throw new BadRequestException('Job Post not Found');

    const updatedJob = await this.job.updateJob(
      id,
      title || existingJob.title,
      description || existingJob.description,
      requirementsArray || existingJob.requirements,
      Number(salary) || existingJob.salary,
      location || existingJob.location,
      jobType || existingJob.jobType,
      Number(experienceLevel) || existingJob.experienceLevel,
      Number(position) || existingJob.experienceLevel,
    );

    return {
      success: true,
      message: 'Job Post Updated Successfully',
      updatedJob,
    };
  }

  @Delete('delete-job/:id')
  async deleteJob(@Req() req: Request) {
    const { id } = req.params;

    if (!id) throw new BadRequestException('Job Details Required');

    if (!req.user || req.user.role !== 'Recruiter')
      throw new UnauthorizedException('Recruiter only Route');

    const existingJob = await this.job.getJob(id);

    if (!existingJob) throw new BadRequestException("Job Post doesn't exist");

    const deletedJob = await this.job.deleteJob(id);

    return {
      success: true,
      message: 'Job Post Deleted Successfully',
      deletedJob,
    };
  }
}
