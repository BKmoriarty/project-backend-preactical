import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { EmailService } from '../../application/services/email.service';
import { SendEmailDto } from '../../application/dtos/email.dto';
import { JwtAuthGuard } from '../../infrastructure/jwt/jwt.guard';

@Controller('emails')
@UseGuards(JwtAuthGuard)
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post()
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.emailService.sendEmail(sendEmailDto);
  }

  @Get(':jobId')
  async getEmailStatus(@Param('jobId') jobId: string) {
    return this.emailService.getEmailStatus(jobId);
  }
}
