import { Module } from '@nestjs/common';
import { ReceiptsController } from './receipts.controller';

import { ReceiptsService } from './receipts.service';
import { TypeOrmModule} from '@nestjs/typeorm';
import { Receipt } from '../database/entities/receipts.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Receipt])],
  controllers: [ReceiptsController],
  providers: [ReceiptsService]
})
export class ReceiptsModule {}
