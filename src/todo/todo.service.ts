import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo, TodoDocument } from '../schemas/todo.schema';
import { Model, Types, FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async create(createTodoDto: CreateTodoDto) {
    const newTodo: Todo = {
      createdAt: new Date(),
      ...createTodoDto,
    };

    return await this.todoModel.create(newTodo);
  }

  async findAll(owner: Types.ObjectId) {
    const query: FilterQuery<TodoDocument> = {
      $or: [
        { owner },
        { watcher: { $in: [owner] } },
        { assignee: { $in: [owner] } },
      ],
    };
    return await this.todoModel.find(query);
  }

  async findOne(id: Types.ObjectId) {
    return await this.todoModel.findById(id);
  }

  async update(id: Types.ObjectId, updateTodoDto: UpdateTodoDto) {
    const todo = await this.todoModel.findById(id);
    if (updateTodoDto.done && todo.parent) {
      const query: FilterQuery<TodoDocument> = {
        $and: [{ parent: todo.parent }, { _id: { $ne: todo._id } }],
      };
      const children = await this.todoModel.find(query);
      if (children.every((child) => child.done)) {
        await this.todoModel.updateOne({ _id: todo.parent }, { done: true });
      }
    }

    return await todo.updateOne(updateTodoDto);
  }

  async remove(id: Types.ObjectId) {
    return await this.todoModel.findByIdAndDelete(id);
  }
}
