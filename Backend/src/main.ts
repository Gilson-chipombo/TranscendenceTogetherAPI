import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const cors = require("cors");

  app.useStaticAssets('uploads', {
    prefix: '/uploads/',
  });
  // app.use(compression()); // Disabled
  app.use(cookieParser());
  
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  });
  
  app.useGlobalFilters(new AllExceptionsFilter());
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  
  app.use(cors());
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

// bootstrap().catch(err => {
//   console.error('Error during application startup:', err);
//   process.exit(1);
// });

bootstrap();
