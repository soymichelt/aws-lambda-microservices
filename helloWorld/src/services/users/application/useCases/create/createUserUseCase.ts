import { UseCase } from '@shared/domain/useCases/useCase';
import { CreateUserRequest } from '@services/users/application/useCases/create/createUserRequest';
import { UserResponse } from '@services/users/application/responses/userResponse';
import { User } from '@services/users/domain/user';
import { inject, injectable } from 'tsyringe';
import { EventBus } from '@shared/domain/events/eventBus';
import { UserRepository } from '@services/users/domain/repositories/userRepository';
import { Id } from '@shared/domain/valueObjects/id';
import { UserName } from '@services/users/domain/valueObjects/userName';
import { UserEmail } from '@services/users/domain/valueObjects/userEmail';
import { UserPassword } from '@services/users/domain/valueObjects/userPassword';
import { EncriptionService } from '@shared/domain/services/encriptionService';

@injectable()
export class CreateUserUseCase extends UseCase<CreateUserRequest, UserResponse> {
  constructor(
    @inject('EventBus') private eventBus: EventBus,
    @inject('UserRepository') private repository: UserRepository,
    @inject('EncriptionService') private encriptionService: EncriptionService
  ) {
    super();
  }

  public async run(request: CreateUserRequest): Promise<UserResponse> {
    const encryptedPassword = await this.encriptionService.encrypt(request.password);

    const user = User.create({
      userId: Id.newId(),
      username: UserName.build(request.username),
      email: UserEmail.build(request.email),
      password: UserPassword.build(encryptedPassword),
    });

    await this.repository.update(user);
    await this.eventBus.publish(user.pullEvents());

    const result = user.toPrimitives();
    delete result.password;

    return { ...result };
  }
}
