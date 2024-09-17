import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async findCompany(name: string) {
    return await this.prisma.company.findFirst({ where: { name } });
  }

  async findCompanyById(id: string) {
    return await this.prisma.company.findUnique({ where: { id } });
  }

  async createCompany(id: string, name: string) {
    return await this.prisma.company.create({
      data: {
        name,
        description: 'Add description',
        location: 'Add Location',
        logo: '',
        website: 'Provide a Link for your Website if exists',
        user: { connect: { id } },
      },
    });
  }

  async updateCompany(
    id: string,
    name: string,
    description: string,
    location: string,
    logo: string,
    website: string,
  ) {
    return await this.prisma.company.update({
      where: { id },
      data: {
        name,
        description,
        location,
        logo,
        website,
      },
    });
  }

  async findUserCompanys(id: string) {
    return await this.prisma.company.findMany({
      where: { user: { id } },
    });
  }

  async deleteCompany(id: string) {
    await this.prisma.application.deleteMany({
      where: {
        job: {
          companyId: id,
        },
      },
    });

    await this.prisma.job.deleteMany({
      where: {
        companyId: id,
      },
    });

    return await this.prisma.company.delete({
      where: { id },
    });
  }
}
