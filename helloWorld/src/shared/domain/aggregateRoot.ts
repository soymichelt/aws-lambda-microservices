import { DomainEvent } from '@shared/domain/events/domainEvent';

export abstract class AggregateRoot {
  private events: DomainEvent[]

  constructor() {
    this.events = []
  }

  public pushEvent(event: DomainEvent): void {
    this.events.push(event);
  }

  public pullEvents(): DomainEvent[] {
    const prevEvents = [...this.events];
    this.events = [];

    return prevEvents;
  }

  public abstract toPrimitives(): any;
}
