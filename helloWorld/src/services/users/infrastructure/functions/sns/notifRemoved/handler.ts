import { Context, SNSEvent } from 'aws-lambda';
import { container } from '@di/services/users';
import { NotifyUserRemovedController } from './controller';
import middy from '@middy/core';

const invokeController = async function (event: SNSEvent, context: Context) {
  const controller = container.resolve<NotifyUserRemovedController>('NotifyUserRemovedController');
  return await controller.execute(event, context);
}

export const handler = middy(invokeController);
