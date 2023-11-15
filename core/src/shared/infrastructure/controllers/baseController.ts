import { Context } from 'aws-lambda';
import { ManagerRequestParsersController } from '@shared/infrastructure/controllers/managerRequestParsersController';
import { inject } from 'tsyringe';
import { DomainException } from '@shared/domain/exceptions/baseException';
import { BaseResponseType } from '@shared/infrastructure/controllers/responses/baseResponseType';

export abstract class BaseController<RequestType, ResponseType> {
  private managerRequestParser: ManagerRequestParsersController;

  constructor(@inject('ManageRequestParsersController') managerRequestParser: ManagerRequestParsersController) {
    this.managerRequestParser = managerRequestParser;
  }

  public async execute(event: any, context: Context): Promise<BaseResponseType> {
    try {
      const request = this.parseEventToRequest(event, context);
      const result = await this.run(request, context);

      return this.generateSuccessResult(result);
    }
    catch (error) {
      return this.generateErrorResult(error);
    }
  }

  public abstract run(request: RequestType, context: Context): Promise<ResponseType>;

  protected getSuccessStatusCode(response: ResponseType): number {
    if (!response) {
      return 204;
    }

    return 200;
  }

  private parseEventToRequest(event: any, context: Context): RequestType {
    const parser = this.managerRequestParser.getParser(event, context);
    const request = parser.parseRequest<RequestType>(event, context);
    return request;
  }

  private generateSuccessResult(response: ResponseType): BaseResponseType {
    return {
      statusCode: this.getSuccessStatusCode(response),
      body: response
        ? JSON.stringify(response)
        : undefined,
    };
  }

  private generateErrorResult(error: DomainException): BaseResponseType {
    return {
      statusCode: error.status || 500,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
}
