import 'reflect-metadata';
import { EventBus } from '@shared/domain/events/eventBus';
import { HttpRequestParserController } from '@shared/infrastructure/controllers/httpRequestParserController';
import { ManagerRequestParsersController } from '@shared/infrastructure/controllers/managerRequestParsersController';
import { RequestParserController } from '@shared/infrastructure/controllers/requestParserController';
import { SnsRequestParserController } from '@shared/infrastructure/controllers/snsRequestParserController';
import { EventBusSns } from '@shared/infrastructure/events/eventBusSns';

import { container } from 'tsyringe';
import { MongoClientFactory } from '@shared/infrastructure/persistence/mongodb/mongoClientFactory';
import { EncriptionService } from '@shared/domain/services/encriptionService';
import { CryptoEncriptionService } from '@shared/infrastructure/services/encription/cryptoEncriptionService';
import { KeyStoreService } from '@shared/domain/services/keyStoreService';
import { SsmKeyStoreService } from '@shared/infrastructure/services/keyStore/ssmKeyStoreService';

container
  .register<RequestParserController>('RequestParserController', HttpRequestParserController)
  .register<RequestParserController>('RequestParserController', SnsRequestParserController)
  .register<ManagerRequestParsersController>('ManagerRequestParsersController', ManagerRequestParsersController)
  .register<EventBus>('EventBus', {
    useValue: new EventBusSns({
      serviceName: `${process.env.APP}.${process.env.SERVICE}`,
      version: process.env.EVENT_BUS_VERSION,
      awsRegion: process.env.REGION,
      topicArn: process.env.SNS_TOPIC_ARN,
    }),
  })
  .register<MongoClientFactory>('MongoClientFactory', {
    useValue: new MongoClientFactory({
      uri: process.env.MONGO_DATABASE_URI,
      databaseName: process.env.MONGO_DATABASE_NAME,
    }),
  })
  .register<EncriptionService>('EncriptionService', {
    useValue: new CryptoEncriptionService({
      secretKey: process.env.CRYPTO_SECRET_KEY,
      secretIV: process.env.CRYPTO_SECRET_IV,
    })
  })
  .register<KeyStoreService>('KeyStoreService', {
    useValue: new SsmKeyStoreService({
      awsRegion: process.env.REGION,
    }),
  });

export { container };
