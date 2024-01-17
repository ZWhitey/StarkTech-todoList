import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  done: boolean;
  @ApiProperty()
  dueDate: Date;
  @ApiProperty()
  owner: Types.ObjectId;
  @ApiProperty()
  watcher?: Types.ObjectId[];
  @ApiProperty()
  assignee?: Types.ObjectId[];
  @ApiProperty()
  parent?: Types.ObjectId;
}
