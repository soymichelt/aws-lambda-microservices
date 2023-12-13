import { UseCase } from '@shared/domain/useCases/useCase';
import { RemoveUserRequest } from './removeUserRequest';
import { inject, injectable } from 'tsyringe';
import { UserRepository } from '@services/users/domain/repositories/userRepository';
import { Id } from '@shared/domain/valueObjects/id';
import { EventBus } from '@shared/domain/events/eventBus';

@injectable()
export class RemoveUserUseCase extends UseCase<RemoveUserRequest, void> {
  constructor(
    @inject('UserRepository') private repository: UserRepository,
    @inject('EventBus') private eventBus: EventBus
  ) {
    super();
  }

  public async run(request: RemoveUserRequest): Promise<void> {
    const userId = Id.fromString(request.userId);

    const user = await this.repository.find(userId);
    if (!user) {
      return;
    }
    
    user.remove();

    await this.repository.delete(userId);
    await this.eventBus.publish(user.pullEvents());
  }
}
