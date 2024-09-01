import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as fileUpload from 'express-fileupload';
import { cloudinaryConnect } from './config/cloudinary.service';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT!;

  app.use(cookieParser());

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
    }),
  );

  cloudinaryConnect();

  await app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
  });
}
bootstrap();
