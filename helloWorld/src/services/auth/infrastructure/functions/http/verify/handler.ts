import middy from '@middy/core';
import { APIGatewayRequestAuthorizerEvent, Context } from 'aws-lambda';
import { container } from '@di/services/auth';
import { VerifyIfAuthorizedController } from '@services/auth/infrastructure/functions/http/verify/controller';

const invokeController = async function (event: APIGatewayRequestAuthorizerEvent, context: Context) {
  const controller = container.resolve<VerifyIfAuthorizedController>('VerifyIfAuthorizedController');
  const result = await controller.execute(event, context);
  return result;
};

export const handler = middy(invokeController);
