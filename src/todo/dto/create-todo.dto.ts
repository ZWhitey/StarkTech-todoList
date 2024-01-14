import { Types } from 'mongoose';

export class CreateTodoDto {
  title: string;
  description: string;
  done: boolean;
  dueDate: Date;
  watcher?: Types.ObjectId[];
  assignee?: Types.ObjectId[];
}
