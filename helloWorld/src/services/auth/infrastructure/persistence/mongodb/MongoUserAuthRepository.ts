import { injectable } from 'tsyringe';
import { createHash } from 'crypto'
import { UserAuth } from '@services/auth/domain/auth';
import { UserAuthRepository } from '@services/auth/domain/repositories/userAuthRepository';
import { MongoRepository } from '@shared/infrastructure/persistence/mongodb/mongoRepository';
import { UserToken } from '@services/auth/domain/valueObjects/userToken';
import { UserId } from '@services/auth/domain/valueObjects/userId';

const USER_AUTH_COLLECTION = 'users';

@injectable()
export class MongoUserAuthRepository extends MongoRepository<UserAuth> implements UserAuthRepository {
  constructor() {
    super({ collectionName: USER_AUTH_COLLECTION });
  }

  public async findByToken(userId: UserId, userToken: UserToken): Promise<UserAuth> {
    const userTokenHashed = this.getTokenHashed(userToken.value);
    const collection = await this.collection();
    const document = await collection.findOne({
      _id: userId.value,
      token: userTokenHashed,
    });
    if (!document) return;

    return this.mapToUserAuth(document);
  }

  private getTokenHashed(token: string): string {
    const hash = createHash('sha256');
    hash.update(token);
    return hash.digest('base64');
  }

  private mapToUserAuth(document: any): UserAuth {
    return UserAuth.fromPrimitives({
      userId: document.userId,
      token: document.token,
      roles: document.roles?.map((role: { name: any; }) => role.name) || [],
    });
  }
}
