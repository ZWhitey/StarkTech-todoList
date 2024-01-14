import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() createTodoDto: CreateTodoDto) {
    const userId = new Types.ObjectId(req.user.sub);
    return this.todoService.create({ owner: userId, ...createTodoDto });
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(new Types.ObjectId(id));
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(new Types.ObjectId(id), updateTodoDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(new Types.ObjectId(id));
  }
}
