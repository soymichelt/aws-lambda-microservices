import { UserAuth } from '@services/auth/domain/auth';
import { UserToken } from '@services/auth/domain/valueObjects/userToken';
import { UserId } from '@services/auth/domain/valueObjects/userId';

export interface UserAuthRepository {
  findByToken(userId: UserId, userToken: UserToken): Promise<UserAuth>;
}
