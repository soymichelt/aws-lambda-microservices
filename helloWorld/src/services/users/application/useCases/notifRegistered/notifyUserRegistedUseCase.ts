import { UseCase } from '@shared/domain/useCases/useCase';
import { NotifyUserRegisteredRequest } from '@services/users/application/useCases/notifRegistered/notifyUserRegisteredRequest';
import { UserResponse } from '@services/users/application/responses/userResponse';
import { inject, injectable } from 'tsyringe';
import { UserRepository } from '@services/users/domain/repositories/userRepository';
import { Id } from '@shared/domain/valueObjects/id';
import { Logger } from '@shared/domain/loggers/logger';
import { MailingService } from '@shared/domain/services/mailingService';

@injectable()
export class NotifyUserRegisteredUseCase extends UseCase<NotifyUserRegisteredRequest, UserResponse> {
  constructor(
    @inject('UserRepository') private repository: UserRepository,
    @inject('MailingService') private mailing: MailingService,
    @inject('Logger') private logger: Logger
  ) {
    super();
  }

  public async run(request: NotifyUserRegisteredRequest): Promise<UserResponse> {
    const userId = Id.fromString(request.userId);
    const user = await this.repository.find(userId);
    const result = user.toPrimitives();

    await this.mailing.send({
      subject: 'Te damos la bienvenida',
      to: result.email,
      message: `Bienvenido a nuestra plataforma ${result.username}`,
    });

    this.logger.info({
      message: `Email sended to: ${result.phone}`,
    });

    delete result.password;
    return result;
  }
}
