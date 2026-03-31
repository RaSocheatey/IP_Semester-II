// import { Module, forwardRef } from '@nestjs/common';
// import { NotificationsService } from './notifications.service';
// import {OrdersModule} from 'src/orders/orders.module';
// @Module({
//   imports: [forwardRef(() => OrdersModule)],
//   providers: [NotificationsService],
//   exports: [NotificationsService],
// })
// export class NotificationsModule {}
import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [CoreModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}