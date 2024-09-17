import { type MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
  controllers: [JobController],
  providers: [PrismaService, JobService],
})
export class JobModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'job/post-job', method: RequestMethod.POST },
        { path: 'job/user-jobs', method: RequestMethod.GET },
        { path: 'job/update-job/:id', method: RequestMethod.PUT },
        { path: 'job/delete-job/:id', method: RequestMethod.DELETE },
      );
  }
}
