import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  
  @Post()
  createTask(@Body() body: any) {
    return this.taskService.createTask(body);
  }

  @Get(':id')
  getTask(@Param('id') id: string) {
    // FIX: Add + before id to convert string to number
    return this.taskService.getTask(+id); 
  }

  @Patch(':id/done')
  updateTaskDone(@Param('id') id: string, @Body() body: any) {
    // FIX: Add + before id
    return this.taskService.updateTask(+id, body);
  }

  @Patch(':id/pending')
  updateTaskPending(@Param('id') id: string, @Body() body: any) {
    // FIX: Add + before id
    return this.taskService.updateTask(+id, body);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    // FIX: Add + before id
    return this.taskService.deleteTask(+id);
  }
}