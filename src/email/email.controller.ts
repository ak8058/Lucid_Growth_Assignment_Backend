import { Controller, Get, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('process')
  async processEmails() {
    return this.emailService.processNewEmails();
  }

  @Get()
  async getAllEmails() {
    return this.emailService.getAllEmails();
  }
}
