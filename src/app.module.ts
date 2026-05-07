import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptsModule } from './receipts/receipts.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationsModule } from './notifications/notifications.module';
import { OrdersModule } from './orders/orders.module';
import { CoreModule } from './core/core.module';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { GraphqlModule } from './graphql/graphql.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'e20221446',
      database: 'receipt_db',
      autoLoadEntities: true, //This finds your entities automatically
      synchronize: true, // This creates tables in Postgres automatically
    }),
    ReceiptsModule,
    NotificationsModule,
    OrdersModule,
    CoreModule,
    GraphqlModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // ✅ We will switch between schema-first and code-first later
      //typePaths: [join(process.cwd(), 'src/graphql/schema/*.graphql')], // schema-first
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'), // code-first (later)

      playground: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
