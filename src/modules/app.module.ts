import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { JobModule } from './job/job.module';
import { ApplicationModule } from './application/application.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [UserModule, JobModule, ApplicationModule, CompanyModule],
})
export class AppModule {}
