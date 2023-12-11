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
import { Logger } from '@shared/domain/loggers/logger';
import { WinstonLogger } from '@shared/infrastructure/loggers/winston/winstonLogger';
import { MailingService } from '@shared/domain/services/mailingService';
import { ResendMailingService } from '@shared/infrastructure/services/mailing/resendMailingService';

container
  .register<RequestParserController>('RequestParserController', HttpRequestParserController)
  .register<RequestParserController>('RequestParserController', SnsRequestParserController)
  .register<ManagerRequestParsersController>('ManagerRequestParsersController', ManagerRequestParsersController)
  .register<Logger>('Logger', {
    useValue: new WinstonLogger({
      app: process.env.APP,
      service: process.env.SERVICE,
      package: process.env.PACKAGE,
      awsRegion: process.env.REGION,
      stage: process.env.STAGE,
      version: process.env.VERSION,
    }),
  })
  .register<KeyStoreService>('KeyStoreService', {
    useValue: new SsmKeyStoreService({
      awsRegion: process.env.REGION,
    }),
  });

if (process.env.SNS_TOPIC_ARN) {
  container
    .register<EventBus>('EventBus', {
      useValue: new EventBusSns({
        serviceName: `${process.env.APP}.${process.env.SERVICE}`,
        version: process.env.EVENT_BUS_VERSION,
        awsRegion: process.env.REGION,
        topicArn: process.env.SNS_TOPIC_ARN,
      }),
    });
}

if (process.env.MONGO_DATABASE_URI && process.env.MONGO_DATABASE_NAME) {
  container
    .register<MongoClientFactory>('MongoClientFactory', {
      useValue: MongoClientFactory.build({
        uri: process.env.MONGO_DATABASE_URI,
        databaseName: process.env.MONGO_DATABASE_NAME,
      }),
    });
}

if (process.env.CRYPTO_SECRET_KEY && process.env.CRYPTO_SECRET_IV) {
  container
    .register<EncriptionService>('EncriptionService', {
      useValue: new CryptoEncriptionService({
        secretKey: String(process.env.CRYPTO_SECRET_KEY),
        secretIV: String(process.env.CRYPTO_SECRET_IV),
      })
    });
}

if (process.env.RESEND_API_KEY && process.env.RESEND_EMAIL_FROM) {
  container
    .register<MailingService>('MailingService', {
      useValue: new ResendMailingService({
        apiKey: process.env.RESEND_API_KEY,
        emailFrom: process.env.RESEND_EMAIL_FROM,
      })
    });
}

export { container };
