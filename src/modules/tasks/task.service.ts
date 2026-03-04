import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepo: Repository<Task>, 
  ) {}



  // This allows the frontend to see all tasks from SQLite
  // async getAllTasks() {
  //   return await this.tasksRepo.find({ relations: ['user'] });
  // }


  async createTask(body: any) {
    const task = this.tasksRepo.create(body);
    return await this.tasksRepo.save(task);
  }

  // FIX: Added 'getTask' to match Controller
  async getTask(id: number) {
    const task = await this.tasksRepo.findOne({ where: { id }, relations: ['user'] });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  // FIX: Added 'updateTask' to match Controller
  async updateTask(id: number, body: any) {
    await this.getTask(id);
    await this.tasksRepo.update(id, {
      completedAt: new Date()
    });
    return this.getTask(id);
  }

  // FIX: Added 'deleteTask' to match Controller
  async deleteTask(id: number) {
    await this.tasksRepo.delete(id);
    return { message: 'Task deleted successfully' };
  }
}