import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const EmailQueueModule = BullModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    redis: {
      host: configService.get<string>('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
      password: configService.get<string>('REDIS_PASSWORD'),
    },
  }),
  inject: [ConfigService],
});
