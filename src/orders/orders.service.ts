import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class OrdersService {
    constructor(
        @Inject('ORDERS_SERVICE') private client: ClientProxy,
        @Inject(forwardRef(() => NotificationsService))
        private readonly notifications: NotificationsService,
    ){}

    createOrder(orderDto: any){
        this.client.emit('order_created', {
            order: orderDto, 
            createdAt: new Date().toISOString()
        });

        this.notifications.notify('order_created',{
            order: orderDto,
        });
        return {status: 'Order accepted',order: orderDto}; 
    }
}

