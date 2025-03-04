import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  @Process('send')
  async handleSendEmail(
    job: Job<{ to: string; subject: string; body: string }>,
  ) {
    const { to, subject, body } = job.data;
    this.logger.log(`Sending email to ${to} with subject: ${subject}`);
    this.logger.log(`Email body: ${body}`);

    // จำลองการส่ง email (ใน production ใช้ library เช่น nodemailer)
    await new Promise((resolve) => setTimeout(resolve, 30000)); // จำลอง delay 30 วินาที
    this.logger.log(`Email sent to ${to}`);
  }
}
