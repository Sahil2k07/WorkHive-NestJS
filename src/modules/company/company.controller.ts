import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import type { Request } from 'express';
import { ZodPipe } from 'src/pipe/ZodPipe.pipe';
import {
  type RegisterCompanyDto,
  registerCompanySchema,
  type UpdateCompanyDto,
  updateCompanySchema,
} from 'src/dto/company.dto';
import { CloudinaryService } from 'src/config/cloudinary.service';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly company: CompanyService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  @Post('register-company')
  @UsePipes(new ZodPipe(registerCompanySchema))
  async registerCompany(@Req() req: Request) {
    const { name } = req.body as RegisterCompanyDto;

    const { id } = req.user;

    if (req.user.role !== 'Recruiter')
      throw new UnauthorizedException('Recruiters only Route');

    if (!name) throw new NotAcceptableException('Company Name Required');

    const existingCompany = await this.company.findCompany(name);

    if (existingCompany)
      throw new BadRequestException('Company already exists with this name');

    const company = await this.company.createCompany(id, name);

    return {
      success: true,
      message: 'Company Registerd Successfully',
      company,
    };
  }

  @Put('update-company/:id')
  @UsePipes(new ZodPipe(updateCompanySchema))
  async updateCompany(@Req() req: Request) {
    const { id } = req.params;

    if (req.user.role !== 'Recruiter')
      throw new UnauthorizedException('Recruiters only Route');

    const existingCompany = await this.company.findCompanyById(id);

    const { name, description, website, location } =
      req.body as UpdateCompanyDto;

    if (!existingCompany)
      throw new BadRequestException("Company doesn't exist");

    let logo = existingCompany.logo;

    if (req.files && req.files.logo) {
      try {
        const file = Array.isArray(req.files.logo)
          ? req.files.logo[0]
          : req.files.logo;

        const cloudResponse = await this.cloudinary.Uploader(
          file,
          process.env.FOLDER_NAME,
        );

        logo = cloudResponse.secure_url;
      } catch (error) {
        throw new InternalServerErrorException('Error while Updating Logo');
      }
    }

    const updatedCompany = await this.company.updateCompany(
      id,
      name || existingCompany.name,
      description || existingCompany.description,
      location || existingCompany.description,
      logo,
      website || existingCompany.website,
    );

    return {
      success: true,
      message: 'Company Updated Successfully',
      updatedCompany,
    };
  }

  @Get('get-company/:id')
  async getCompanyById(@Req() req: Request) {
    const { id } = req.params;

    const company = await this.company.findCompanyById(id);

    if (!company) throw new NotFoundException('Company not Found');

    return {
      success: true,
      message: 'Company data fetched Successfully',
      company,
    };
  }

  @Get('user-company')
  async getUserCompany(@Req() req: Request) {
    const { id } = req.user;

    if (req.user.role !== 'Recruiter')
      throw new UnauthorizedException('Recruiters only Route');

    const company = await this.company.findUserCompanys(id);

    return {
      success: true,
      message: 'Got All created Companys successfully',
      company,
    };
  }

  @Delete('delete-company')
  async deleteComapany(@Req() req: Request) {
    if (req.user.role !== 'Recruiter')
      throw new UnauthorizedException('Recruiters only Route');

    const { id } = req.body;

    if (!id) throw new BadRequestException('Company details not Found');

    const existingCompany = await this.company.findCompanyById(id);

    if (!existingCompany)
      throw new BadRequestException('Company data not Found');

    const deletedCompany = await this.company.deleteCompany(id);

    return {
      success: true,
      message: 'Company deleted successfully',
      deletedCompany,
    };
  }
}
