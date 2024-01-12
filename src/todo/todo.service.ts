import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  todoList: Todo[] = [];

  create(createTodoDto: CreateTodoDto) {
    const newTodo: Todo = {
      id: this.todoList.length + 1,
      createdAt: new Date(),
      owner: 1,
      ...createTodoDto,
    };
    this.todoList.push(newTodo);
    return newTodo;
  }

  findAll() {
    return this.todoList;
  }

  findOne(id: number) {
    return this.todoList.find((todo) => todo.id === id);
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    const todo = this.findOne(id);
    if (!todo) {
      return null;
    }
    const updatedTodo = {
      ...todo,
      ...updateTodoDto,
    };
    this.todoList = this.todoList.map((todo) =>
      todo.id === id ? updatedTodo : todo,
    );
    return updatedTodo;
  }

  remove(id: number) {
    const countBefore = this.todoList.length;
    this.todoList = this.todoList.filter((todo) => todo.id !== id);
    return countBefore - this.todoList.length;
  }
}
