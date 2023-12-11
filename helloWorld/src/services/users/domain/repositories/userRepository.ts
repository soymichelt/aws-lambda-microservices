import { User } from '@services/users/domain/user';
import { Id } from '@shared/domain/valueObjects/id';

export interface UserRepository {
  all(): Promise<User[]>;
  find(userId: Id): Promise<User>;
  update(user: User): Promise<void>;
  delete(userId: Id): Promise<void>;
}
