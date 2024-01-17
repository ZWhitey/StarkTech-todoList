import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  done: boolean;
  @ApiProperty()
  dueDate: Date;
  @ApiProperty()
  watcher?: Types.ObjectId[];
  @ApiProperty()
  assignee?: Types.ObjectId[];
}
