import { Types } from 'mongoose';
export class Todo {
  public readonly id: Types.ObjectId;
  public readonly title: string;
  public readonly description: string;
  public readonly done: boolean;
  public readonly dueDate: Date;
  public readonly createdAt: Date;
  public readonly owner: Types.ObjectId;
  public readonly watcher?: Types.ObjectId[];
  public readonly assignee?: Types.ObjectId[];
  public readonly parent?: Types.ObjectId;
}
