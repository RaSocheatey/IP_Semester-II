import { Module } from '@nestjs/common';
import { ReceiptsController } from './receipts.controller';

import { ReceiptsService } from './receipts.service';
import { TypeOrmModule} from '@nestjs/typeorm';
import { Receipt } from '../database/entities/receipts.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
@Module({
  imports: [TypeOrmModule.forFeature([Receipt]), NotificationsModule],
  controllers: [ReceiptsController],
  providers: [ReceiptsService],
})
export class ReceiptsModule {}
