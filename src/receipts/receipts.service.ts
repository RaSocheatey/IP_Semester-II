import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt } from '../database/entities/receipts.entity'; // Ensure this path is correct
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
@Injectable()
export class ReceiptsService {
  constructor(
    // We "Inject" the repository to use TypeORM's built-in methods (save, find, remove)
    @InjectRepository(Receipt)
    private readonly receiptRepo: Repository<Receipt>,
    private readonly notifications: NotificationsService,
  ) {}

  // Get all receipts, ordered by date
  async findAll() {
    return this.receiptRepo.find({ order: { issuedAt: 'DESC' } });
  }

  // Get one receipt or throw a 404 error if not found
  async findOne(receiptId: string) {
    const receipt = await this.receiptRepo.findOne({ where: { receiptId } });
    if (!receipt) throw new NotFoundException('Receipt not found');
    return receipt;
  }

  // Convert DTO data into an Entity and save it to Postgres
  async create(dto: CreateReceiptDto) {
    // 1. Create the entity instance
    const receipt = this.receiptRepo.create({
      issuedAt: new Date(dto.issuedAt),
      name: dto.name,
      price: dto.price,
    });

    // 2. Save to PostgreSQL
    const savedReceipt = await this.receiptRepo.save(receipt);
      this.notifications.notify('receipt_created', {
      receiptId: savedReceipt.receiptId,
      price: savedReceipt.price,
    });

    // Improved RabbitMQ Payload simulation
    const eventPayload = {
      pattern: 'receipt_created', // The "topic" or "routing key"
      data: {
        id: savedReceipt.receiptId,
        name: savedReceipt.name,
        total: savedReceipt.price,
        occurredAt: new Date().toISOString(),
      },
    };

    console.log('--- [RabbitMQ] Event Emitted ---');
    console.log(JSON.stringify(eventPayload, null, 2));

    return savedReceipt;
  }

  // Find the receipt first, then update only the fields provided
  async update(receiptId: string, dto: UpdateReceiptDto) {
    const receipt = await this.findOne(receiptId);

    if (dto.issuedAt !== undefined) receipt.issuedAt = new Date(dto.issuedAt);
    if (dto.name !== undefined) receipt.name = dto.name;
    if (dto.price !== undefined) receipt.price = dto.price;

    return this.receiptRepo.save(receipt);
  }

  // Remove the record from the database
  async remove(receiptId: string) {
    const receipt = await this.findOne(receiptId);
    await this.receiptRepo.remove(receipt);
    return { deleted: true, receiptId };
  }
}