import { RequestParserController } from '@shared/infrastructure/controllers/requestParserController';
import { Context, SQSEvent } from 'aws-lambda';
import { injectable } from 'tsyringe';

@injectable()
export class SqsRequestParserController implements RequestParserController {
  public match(event: SQSEvent, _context: Context): boolean {
    return !!event.Records?.[0].messageId;
  }

  public parseRequest<T>(event: SQSEvent, _context: Context): T {
    return {
      body: this.getBodyFromEvent(event),
    } as T;
  }

  private getBodyFromEvent(event: SQSEvent): Record<string, any> {
    const { Records } = event;

    if (!Records.length) return;

    if (Records.length === 1) {
      return {
        body: JSON.parse(Records[0].body),
      };
    }

    return {
      body: Records.map(record => JSON.parse(record.body)),
    };
  }
}
