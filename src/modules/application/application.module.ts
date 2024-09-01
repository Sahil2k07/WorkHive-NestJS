import { type MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { PrismaService } from 'src/config/prisma.service';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService, PrismaService],
})
export class ApplicationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'application/apply-job/:jobId', method: RequestMethod.POST },
        { path: 'application/applied-jobs', method: RequestMethod.GET },
        { path: 'application/update-status/:id', method: RequestMethod.PUT },
        { path: 'application/get-applicants/:id', method: RequestMethod.GET },
        { path: 'application/update-status/:id', method: RequestMethod.PUT },
      );
  }
}
