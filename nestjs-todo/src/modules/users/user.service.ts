import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>, // Injecting the database repository
  ) {}

  // FIX: Create a real user in the database
  async createUser(body: any) {
    const user = this.usersRepo.create(body);
    return await this.usersRepo.save(user);
  }

  // FIX: Find a real user and include their tasks
  async getUser(username: string) {
    const user = await this.usersRepo.findOne({ 
      where: { username }, 
      relations: ['tasks'] 
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // FIX: Update logic using TypeORM
  async updateUser(body: any) {
    await this.usersRepo.update({ username: body.username }, body);
    return this.getUser(body.username);
  }

  // FIX: Delete logic
  async deleteUser(username: string) {
    await this.usersRepo.delete({ username });
    return { message: 'success' };
  }
}