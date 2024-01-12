export class CreateTodoDto {
  title: string;
  description: string;
  done: boolean;
  dueDate: Date;
  watcher?: number[];
  assignee?: number[];
}
