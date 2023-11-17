import middy from '@middy/core';
import { APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { container } from '@di/services/ping';
import { GetHealthCheckController } from '@services/ping/infrastructure/functions/http/get/controller';

const invokeController = async function (event: APIGatewayProxyEventV2, context: Context) {
  const controller = container.resolve<GetHealthCheckController>('GetHealthCheckController');
  return await controller.execute(event, context);
}

export const handler = middy(invokeController);
