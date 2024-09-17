import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import type { Request } from 'express';

@Controller('application')
export class ApplicationController {
  constructor(private readonly application: ApplicationService) {}

  @Post('apply-job/:jobId')
  async applyJob(@Req() req: Request) {
    const { id } = req.user;
    const { jobId } = req.params;

    if (req.user.role === 'Recruiter')
      throw new UnauthorizedException('Students only Route');

    if (!jobId) throw new BadRequestException('JobId params Required');

    const existingApplication = await this.application.getUserApplication(
      jobId,
      id,
    );

    if (existingApplication)
      throw new UnauthorizedException('Already applied for this job');

    const job = await this.application.getJob(jobId);

    if (!job) throw new BadRequestException("Job doesn't exist");

    const application = await this.application.applyJob(jobId, id);

    return {
      success: true,
      message: 'Applied for the Job Successfully',
      application,
    };
  }

  @Get('applied-jobs')
  async getAppliedJobs(@Req() req: Request) {
    const { id, role } = req.user;

    if (role !== 'Student')
      throw new UnauthorizedException('Students only Route');

    const appliedJobs = await this.application.getAppliedJobs(id);

    return {
      success: true,
      message: 'Got all Applied Jobs',
      appliedJobs,
    };
  }

  @Get('get-applicants/:id')
  async getApplicants(@Req() req: Request) {
    const { id } = req.params;

    if (req.user.role !== 'Recruiter')
      throw new UnauthorizedException('Recruiter only Route');

    const job = await this.application.getJob(id);

    if (!job) throw new BadRequestException('No Jobs found with matching ID');

    const applicants = await this.application.getApplicants(id);

    return {
      success: true,
      message: 'Got all the Applicants Successfully',
      applicants,
    };
  }

  @Put('update-status/:id')
  async updateStatus(@Req() req: Request) {
    const { status } = req.body;

    if (req.user.role !== 'Recruiter')
      throw new UnauthorizedException('Recruiters route only');

    const { id } = req.params;

    if (!status && (status !== 'Pending' || 'Accepted' || 'Rejected')) {
      throw new BadRequestException(
        'Status Required and can be Pending | Accepted | Rejected, only',
      );
    }

    const application = await this.application.getApplication(id);

    if (!application)
      throw new BadRequestException('No application found with the ID');

    const updatedApplication = await this.application.updateApplication(
      id,
      status,
    );

    return {
      success: true,
      message: 'Applicaition updated Successfully',
      updatedApplication,
    };
  }
}
