import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) =>
          Object.values(error.constraints).join(', '),
        );
        return new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Validation failed',
            messages,
          },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );
  const port = parseInt(process.env.PORT, 10) || 3000;
  await app.listen(port);
}
bootstrap();
