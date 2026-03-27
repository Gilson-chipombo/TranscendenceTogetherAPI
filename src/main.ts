import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const cors = require("cors");

  app.useStaticAssets('uploads', {
    prefix: '/uploads/',
  });
  // app.use(compression());
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
  
  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Together API')
    .setDescription('API documentation for Together - A real-time communication platform')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access_token'
    )
    .addTag('Chat', 'Real-time messaging and room messages')
    .addTag('Rooms', 'Room management and invitations')
    .addTag('Auth', 'Authentication endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
    },
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation available at: http://localhost:${port}/api/docs`);
}

// bootstrap().catch(err => {
//   console.error('Error during application startup:', err);
//   process.exit(1);
// });

bootstrap();
