import { AggregateRoot } from '@shared/domain/aggregateRoot';
import { UserName } from '@services/users/domain/valueObjects/userName';
import { UserPassword } from '@services/users/domain/valueObjects/userPassword';
import { UserEmail } from '@services/users/domain/valueObjects/userEmail';
import { DateValueObject } from '@shared/domain/valueObjects/dateValueObject';
import { Id } from '@shared/domain/valueObjects/id';
import { UserCreatedEvent } from '@services/users/domain/events/userCreatedEvent';

type UserProps = {
  userId: Id;
  username: UserName;
  email: UserEmail;
  password: UserPassword;

  createdAt?: DateValueObject;
  updatedAt?: DateValueObject;
};

export type UserPrimitivesProps = {
  userId: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

export class User extends AggregateRoot {
  readonly userId: Id
  private username: UserName;
  private email: UserEmail;
  private password: UserPassword;

  private constructor(props: UserProps) {
    super();

    this.userId = props.userId;
    this.username = props.username;
    this.email = props.email;
    this.password = props.password;

    this.createdAt = props.createdAt ?? DateValueObject.now();
    this.updatedAt = props.updatedAt ?? DateValueObject.now();
  }

  public static build(props: UserProps): User {
    return new User(props);
  }

  public static create(props: UserProps): User {
    const newUser = User.build(props);
    const event = UserCreatedEvent.build(newUser);
    newUser.pushEvent(event);

    return newUser;
  }

  public static fromPrimitives(props: UserPrimitivesProps): User {
    return new User({
      userId: Id.fromString(props.userId),
      username: UserName.build(props.username),
      email: UserEmail.build(props.email),
      password: UserPassword.build(props.password),

      createdAt: DateValueObject.fromString(props.createdAt),
      updatedAt: DateValueObject.fromString(props.updatedAt),
    });
  }

  public toPrimitives(): UserPrimitivesProps {
    return {
      userId: this.userId.toString(),
      username: this.username.value,
      email: this.email.value,
      password: this.password.value,

      createdAt: this.createdAt.toString(),
      updatedAt: this.updatedAt.toString(),
    };
  }
}
