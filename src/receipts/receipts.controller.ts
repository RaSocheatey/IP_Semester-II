import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(ApiKeyGuard)

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Get()
  findAll() {
    return this.receiptsService.findAll();
  }

  // Task: Get a single receipt by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receiptsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateReceiptDto) {
    return this.receiptsService.create(dto);
  }

  // Task: Update a receipt (This fixes your 404 error)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReceiptDto) {
    return this.receiptsService.update(id, dto);
  }

  // Task: Delete a receipt
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.receiptsService.remove(id);
  }
}