// import { forwardRef, Inject, Injectable } from '@nestjs/common';
// import { OrdersService } from 'src/orders/orders.service';

// @Injectable()
// export class NotificationsService {
//   // constructor(private readonly ordersService: OrdersService){}
//   constructor(
//     @Inject(forwardRef(() => OrdersService))
//     private readonly ordersService: OrdersService,
//   ) {}
//     notify(event: string, payload: any) {
//     // For lab: just log
//     console.log(`[NOTIFY] ${event}`, payload);
//     return { ok: true };
//   }
// }

import { Inject, Injectable } from '@nestjs/common';
import { EVENT_PUBLISHER } from 'src/core/tokens';

type EventPublisher = { publish: (event: string, payload: any) => void };

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(EVENT_PUBLISHER)
    private readonly publisher: EventPublisher,
  ) {}

  notify(event: string, payload: any) {
    this.publisher.publish(event, payload);
    return { ok: true };
  }
}