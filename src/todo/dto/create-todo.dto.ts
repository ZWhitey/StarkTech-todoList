import { Types } from 'mongoose';

export class CreateTodoDto {
  title: string;
  description: string;
  done: boolean;
  dueDate: Date;
  owner: Types.ObjectId;
  watcher?: Types.ObjectId[];
  assignee?: Types.ObjectId[];
}
