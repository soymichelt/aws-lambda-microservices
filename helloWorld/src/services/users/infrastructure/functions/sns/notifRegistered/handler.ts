import { Context, SNSEvent } from 'aws-lambda';
import { container } from '@di/services/users';
import { NotifyUserRegisteredController } from './controller';
import middy from '@middy/core';

const invokeController = async function(event: SNSEvent, context: Context) {
  const controller = container.resolve<NotifyUserRegisteredController>('NotifyUserRegisteredController');
  return await controller.execute(event, context);
}

export const handler = middy(invokeController);
