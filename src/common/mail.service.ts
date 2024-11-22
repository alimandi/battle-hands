import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail() {
    await this.mailerService.sendMail({
      to: 'recipient@example.com',
      subject: 'Test Email',
      template: './test',
      context: {
        name: 'Recipient Name',
      },
    });
  }
}
