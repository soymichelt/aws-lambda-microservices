import { APIGatewayProxyCallbackV2, Context } from 'aws-lambda';
import { container } from '@di/services/users';
import { GetAllUsersController } from '@services/users/infrastructure/functions/http/getAll/controller';
import middy from '@middy/core';

const invokeController = async function(event: APIGatewayProxyCallbackV2, context: Context) {
  const controller = container.resolve<GetAllUsersController>('GetAllUsersController');
  return await controller.execute(event, context);
}

export const handler = middy(invokeController);
