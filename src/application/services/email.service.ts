import { Injectable, NotFoundException } from '@nestjs/common';
import { SendEmailUseCase } from '../../domain/use-cases/email/send-email.use-case';
import { GetEmailStatusUseCase } from '../../domain/use-cases/email/get-email-status.use-case';
import { SendEmailDto } from '../dtos/email.dto';

@Injectable()
export class EmailService {
  constructor(
    private sendEmailUseCase: SendEmailUseCase,
    private getEmailStatusUseCase: GetEmailStatusUseCase,
  ) {}

  async sendEmail(sendEmailDto: SendEmailDto) {
    const jobId = await this.sendEmailUseCase.execute(
      sendEmailDto.to,
      sendEmailDto.subject,
      sendEmailDto.body,
    );
    return { jobId, message: 'Email queued successfully' };
  }

  async getEmailStatus(jobId: string) {
    try {
      const status = await this.getEmailStatusUseCase.execute(jobId);
      return { jobId, status };
    } catch (error) {
      if (error.message === 'Job not found') {
        throw new NotFoundException('Email job not found');
      }
      throw error;
    }
  }
}
