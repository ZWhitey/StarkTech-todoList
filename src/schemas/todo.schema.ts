import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TodoDocument = HydratedDocument<Todo>;

@Schema()
export class Todo {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  done: boolean;

  @Prop()
  dueDate: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  owner: Types.ObjectId;

  @Prop()
  watcher?: Types.ObjectId[];

  @Prop()
  assignee?: Types.ObjectId[];
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
