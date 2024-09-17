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

  async updateJob(
    id: string,
    title: string,
    description: string,
    requirements: string[],
    salary: number,
    location: string,
    jobType: string,
    experienceLevel: number,
    position: number,
  ) {
    return await this.prisma.job.update({
      where: { id },
      data: {
        title,
        description,
        requirements,
        salary,
        location,
        jobType,
        experienceLevel,
        position,
      },
    });
  }

  async deleteJob(id: string) {
    await this.prisma.application.deleteMany({ where: { jobId: id } });

    return await this.prisma.job.delete({ where: { id } });
  }

  async checkJob(title: string, location: string, companyId: string) {
    return await this.prisma.job.findFirst({
      where: { title, location, companyId },
    });
  }

  async userJobs(id: string) {
    return await this.prisma.job.findMany({
      where: { createdBy: { id } },
      include: { company: true },
    });
  }
}
