import { RequestParserController } from '@shared/infrastructure/controllers/requestParserController';
import { Context, SNSEvent } from 'aws-lambda';
import { injectable } from 'tsyringe';

@injectable()
export class SnsRequestParserController implements RequestParserController {
  public match(event: SNSEvent, _context: Context): boolean {
    return !!event.Records?.[0].Sns;
  }

  public parseRequest<T>(event: SNSEvent, _context: Context): T {
    return {
      body: this.getBodyFromEvent(event),
    } as T;
  }

  private getBodyFromEvent(event: SNSEvent): Record<string, any> {
    const { Records } = event;

    if (!Records.length) return;

    if (Records.length === 1) {
      return {
        body: JSON.parse(Records[0].Sns.Message),
      };
    }

    return {
      body: Records.map(record => JSON.parse(record.Sns.Message)),
    };
  }
}
