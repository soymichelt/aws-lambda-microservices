import { APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { container } from '@di/services/users';
import { RemoveUserController } from '@services/users/infrastructure/functions/http/remove/controller';
import middy from '@middy/core';

const invokeController = async function(event: APIGatewayProxyEventV2, context: Context) {
  const controller = container.resolve<RemoveUserController>('RemoveUserController');
  return await controller.execute(event, context);
}

export const handler = middy(invokeController);
