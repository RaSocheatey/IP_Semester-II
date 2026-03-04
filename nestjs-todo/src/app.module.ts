import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/user.entity'; // Import the entities you just made
import { Task } from './modules/tasks/task.entity';
import { UserModule } from './modules/users/user.module';
import { TaskModule } from './modules/tasks/task.module';

// @Module({
//   imports: [UserModule, TaskModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'todo.sqlite',
      entities: [User, Task],
      synchronize: true, // use only in development!
    }),
    UserModule,
    TaskModule,
  ],
})
export class AppModule {}
