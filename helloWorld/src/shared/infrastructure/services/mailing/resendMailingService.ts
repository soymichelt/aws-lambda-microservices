import { Resend } from 'resend';
import { MailingService, SendEmailProps } from '@shared/domain/services/mailingService';

type ResendMailingServiceProps = {
  apiKey: string;
  emailFrom: string;
};

export class ResendMailingService implements MailingService {
  private readonly apiKey: string;
  private readonly emailFrom: string;

  constructor(props: ResendMailingServiceProps) {
    this.apiKey = props.apiKey;
  }

  public async send(props: SendEmailProps): Promise<void> {
    const resend = new Resend(this.apiKey);

    await resend.emails.send({
      from: this.emailFrom,
      to: props.to,
      subject: props.subject,
      html: props.message,
    });
  }
}
