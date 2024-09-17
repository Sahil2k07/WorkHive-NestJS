import { type MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CompanyService } from './company.service';
import { PrismaService } from 'src/config/prisma.service';
import { CompanyController } from './company.controller';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { CloudinaryService } from 'src/config/cloudinary.service';

@Module({
  providers: [CompanyService, PrismaService, CloudinaryService],
  controllers: [CompanyController],
})
export class CompanyModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'company/register-company', method: RequestMethod.POST },
        { path: 'company/update-company/:id', method: RequestMethod.PUT },
        { path: 'company/user-company', method: RequestMethod.GET },
        { path: 'company/delete-company', method: RequestMethod.DELETE },
      );
  }
}
