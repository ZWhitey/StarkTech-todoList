export class Todo {
  public readonly id: number;
  public readonly title: string;
  public readonly description: string;
  public readonly done: boolean;
  public readonly dueDate: Date;
  public readonly createdAt: Date;
  public readonly owner: number;
}
