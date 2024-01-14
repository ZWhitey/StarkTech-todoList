import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo, TodoDocument } from '../schemas/todo.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async create(createTodoDto: CreateTodoDto) {
    const newTodo: Todo = {
      createdAt: new Date(),
      owner: new Types.ObjectId('65a3f14d4a42d9f3cce3e92a'),
      ...createTodoDto,
    };

    return await this.todoModel.create(newTodo);
  }

  async findAll() {
    return await this.todoModel.find();
  }

  async findOne(id: Types.ObjectId) {
    return await this.todoModel.findById(id);
  }

  async update(id: Types.ObjectId, updateTodoDto: UpdateTodoDto) {
    return await this.todoModel.findByIdAndUpdate(id, updateTodoDto);
  }

  async remove(id: Types.ObjectId) {
    return await this.todoModel.findByIdAndDelete(id);
  }
}
