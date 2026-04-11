import { transporter } from '#/modules/email/emailSetup.js';

class EmailService {
  carStockMarketEmail = 'carstockmarket@example.com';

  constructor() {
    this.emailTransport = transporter;
  }

  async sendEmail({ to, subject, template, context }) {
    const html = template(context.context);

    await this.emailTransport.sendMail({
      from: this.carStockMarketEmail,
      to,
      subject,
      html: html,
    });
  }
}

export default EmailService;
