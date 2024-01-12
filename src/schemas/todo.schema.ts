import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
  owner: string;

  @Prop()
  watcher?: string[];

  @Prop()
  assignee?: string[];
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
