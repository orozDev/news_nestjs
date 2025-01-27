import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.setGlobalPrefix('/api/v1/');
  const PORT = config.get<number>('PORT') || 8000;

  // Setting global pipe
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        for (const error of errors) {
          delete error.value;
          delete error.target;
        }
        return new BadRequestException(errors);
      },
      transform: true,
    }),
  );

  // Swagger configuration
  const swagger = new DocumentBuilder()
    .setTitle('Holiday API backend')
    .setDescription('The API description')
    .setVersion('1.0')
    .setBasePath('/api/v1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('/api/v1/swagger', app, document);

  // Cors enable
  app.enableCors();

  await app.listen(PORT, () =>
    console.log(`The server has been started on ${PORT} port`),
  );
}
bootstrap();
