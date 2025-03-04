import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class SendEmailUseCase {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  async execute(to: string, subject: string, body: string): Promise<string> {
    const job = await this.emailQueue.add('send', { to, subject, body });
    return job.id.toString(); // คืน job ID
  }
}
