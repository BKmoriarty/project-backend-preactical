import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './presentation/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';
import { ProductModule } from './presentation/product.module';
import { LoggingModule } from './infrastructure/middleware/logging.module';
import { OrderModule } from './presentation/order.module';
import { EmailQueueModule } from './infrastructure/queue/email.queue';
import { EmailModule } from './presentation/email.module';
import { DynamicDatabaseModule } from './infrastructure/database/dynamic-database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'mysql' as const,
    //     host: configService.get<string>('DB_HOST'),
    //     port: configService.get<number>('DB_PORT'),
    //     username: configService.get<string>('DB_USERNAME'),
    //     password: configService.get<string>('DB_PASSWORD'),
    //     database: configService.get<string>('DB_NAME'),
    //     entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //     synchronize: true,
    //   }),
    //   inject: [ConfigService],
    // }),
    DynamicDatabaseModule.forRoot([
      {
        name: 'default',
        config: {
          type: 'mysql',
          synchronize: true, // ใช้ใน dev เท่านั้น
        },
      },
      {
        name: 'secondary',
        config: {
          type: 'mysql',
          synchronize: true, // ใช้ใน dev เท่านั้น
        },
      },
    ]),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): RedisModuleOptions => ({
        type: 'single',
        url: configService.get<string>('REDIS_URL'),
        options: {
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    EmailQueueModule,
    AuthModule,
    ProductModule,
    OrderModule,
    EmailModule,
    LoggingModule,
  ],
})
export class AppModule {}
