import { ArgRequiredException } from '@shared/domain/exceptions/argRequiredException';
import { MongoClient, Db } from 'mongodb';
import { injectable, singleton } from 'tsyringe';

type MongoClientFactoryProps = {
  uri: string;
  databaseName: string;
};

@injectable()
@singleton()
export class MongoClientFactory {
  private static db: Db;

  private uri: string;
  private databaseName: string;

  constructor(props: MongoClientFactoryProps) {
    this.validateMongoClientProps(props);

    this.uri = props.uri;
    this.databaseName = props.databaseName;
  }

  public async connect(): Promise<Db> {
    if (MongoClientFactory.db) {
      return MongoClientFactory.db;
    }

    const client = await MongoClient.connect(this.uri);
    MongoClientFactory.db = client.db(this.databaseName);
    return MongoClientFactory.db;
  }

  private validateMongoClientProps(props: MongoClientFactoryProps): void {
    if (!props.uri) {
      throw new ArgRequiredException(
        Object
          .entries(props)
          .filter(([_, value]) => !value)
          .map(([key]) => key)
      );
    }
  }
}
