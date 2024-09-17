import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserApplication(jobId: string, id: string) {
    return await this.prisma.application.findFirst({
      where: {
        job: { id: jobId },
        applicant: { id },
      },
    });
  }

  async getJob(jobId: string) {
    return await this.prisma.job.findUnique({
      where: { id: jobId },
      include: { applications: true },
    });
  }

  async applyJob(jobId: string, id: string) {
    return await this.prisma.application.create({
      data: {
        applicant: { connect: { id } },
        job: { connect: { id: jobId } },
      },
    });
  }

  async getAppliedJobs(id: string) {
    return await this.prisma.application.findMany({
      where: { applicant: { id } },
      include: { job: { include: { company: true } } },
    });
  }

  async getApplicants(id: string) {
    return await this.prisma.application.findMany({
      where: { job: { id } },
      include: { applicant: { include: { profile: true } } },
    });
  }

  async getApplication(id: string) {
    return await this.prisma.application.findUnique({
      where: { id },
      include: { applicant: true, job: true },
    });
  }

  async updateApplication(
    id: string,
    status: 'Pending' | 'Accepted' | 'Rejected',
  ) {
    return await this.prisma.application.update({
      where: { id },
      data: { status },
    });
  }
}
