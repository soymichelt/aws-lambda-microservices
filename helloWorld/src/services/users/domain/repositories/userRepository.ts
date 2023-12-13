import { User } from '@services/users/domain/user';
import { Id } from '@shared/domain/valueObjects/id';
import { UserEmail } from '@services/users/domain/valueObjects/userEmail';
import { UserName } from '@services/users/domain/valueObjects/userName';

export interface UserRepository {
  all(): Promise<User[]>;
  find(userId: Id): Promise<User>;
  findByEmail(email: UserEmail): Promise<User>;
  findByUsername(username: UserName): Promise<User>;
  update(user: User): Promise<void>;
  delete(userId: Id): Promise<void>;
}
