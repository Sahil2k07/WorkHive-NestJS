import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';

@Injectable()
export class JobService {
  constructor(private readonly prisma: PrismaService) {}

  async createJob(
    userId: string,
    title: string,
    description: string,
    requirements: string[],
    salary: number,
    location: string,
    jobType: string,
    experience: number,
    position: number,
    companyId: string,
  ) {
    return await this.prisma.job.create({
      data: {
        title,
        description,
        requirements,
        salary,
        location,
        jobType,
        experienceLevel: experience,
        position,
        company: { connect: { id: companyId } },
        createdBy: { connect: { id: userId } },
      },
    });
  }

  async getJobs(keyword?: string) {
    if (keyword) {
      return await this.prisma.job.findMany({
        where: {
          title: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        include: { company: true },
      });
    }

    return await this.prisma.job.findMany({ include: { company: true } });
  }

  async getJob(id: string) {
    return await this.prisma.job.findUnique({
      where: { id },
      include: { applications: true, company: true },
    });
  }

  async userJobs(id: string) {
    return await this.prisma.job.findMany({
      where: { createdBy: { id } },
      include: { company: true },
    });
  }
}
