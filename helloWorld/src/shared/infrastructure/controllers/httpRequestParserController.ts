import { RequestParserController } from '@shared/infrastructure/controllers/requestParserController';
import { APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { injectable } from 'tsyringe';

@injectable()
export class HttpRequestParserController implements RequestParserController {
  public match(event: APIGatewayProxyEventV2, _context: Context): boolean {
    return !!(event.requestContext?.http?.method);
  }

  public parseRequest<T>(event: APIGatewayProxyEventV2, _context: Context): T {
    return {
      ...JSON.parse(event.body || '{}'),
      ...(event.queryStringParameters || {}),
      ...(event.pathParameters || {}),
    } as T;
  }
}
