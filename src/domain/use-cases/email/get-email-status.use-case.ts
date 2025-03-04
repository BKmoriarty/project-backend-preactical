import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class GetEmailStatusUseCase {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  async execute(jobId: string): Promise<string> {
    const job = await this.emailQueue.getJob(jobId);
    if (!job) {
      throw new Error('Job not found');
    }
    return job.getState();
  }
}
