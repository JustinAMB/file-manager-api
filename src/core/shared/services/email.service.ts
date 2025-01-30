import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
  constructor(private _mailerService: MailerService) {}
  async sendEmail(to: string, subject: string, html: string) {
    try {
      await this._mailerService.sendMail({
        to,
        subject,
        html,
      });
    } catch (error) {}
  }
}
