import { RequestParserController } from '@shared/infrastructure/controllers/requestParserController';
import { Context } from 'aws-lambda';
import { injectAll, injectable } from 'tsyringe';

@injectable()
export class ManagerRequestParsersController {
  private parsers: RequestParserController[];

  constructor(@injectAll('RequestParserController') parsers: RequestParserController[]) {
    this.parsers = parsers;
  }

  public getParser(event: any, context: Context): RequestParserController {
    const parser = this.parsers.find(parser => parser.match(event, context));
    if (!parser) {
      throw new Error('RequestParserController has not been found')
    }

    return parser;
  }
}
