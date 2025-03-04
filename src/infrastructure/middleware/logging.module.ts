import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggingMiddleware } from './logging.middleware';

@Module({})
export class LoggingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*'); // ใช้กับทุก route
  }
}
