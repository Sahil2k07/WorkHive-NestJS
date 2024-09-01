import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/config/prisma.service';
import { CloudinaryService } from 'src/config/cloudinary.service';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, CloudinaryService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'user/update-profile', method: RequestMethod.PUT });
  }
}
