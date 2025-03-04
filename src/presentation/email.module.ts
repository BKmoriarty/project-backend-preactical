import { Module } from '@nestjs/common';
import { EmailController } from './controllers/email.controller';
import { EmailService } from '../application/services/email.service';
import { BullModule } from '@nestjs/bull';
import { SendEmailUseCase } from '../domain/use-cases/email/send-email.use-case';
import { GetEmailStatusUseCase } from '../domain/use-cases/email/get-email-status.use-case';
import { EmailProcessor } from '../infrastructure/queue/email.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [EmailController],
  providers: [
    EmailService,
    SendEmailUseCase,
    GetEmailStatusUseCase,
    EmailProcessor,
  ],
})
export class EmailModule {}
