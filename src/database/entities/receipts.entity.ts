import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity('receipts')
export class Receipt{
    @PrimaryGeneratedColumn('uuid')
    receiptId: string;

    @Column({ type: 'timestamp'})
    issuedAt: Date;

    @Column()
    name: string;

    @Column('decimal')
    price: number;
}