import { v4 as uuidv4 } from 'uuid'
export class Todo {
  private id: string
  private createdOn: Date
  private title: string
  private status: TodoStatus
  private history: TodoStatusHistoryItem[]

  constructor(title: string) {
    this.id = uuidv4()
    this.createdOn = new Date()
    this.title = title
    this.status = TodoStatus.UNDONE
    this.history = []
  }

  public getId(): string {
    return this.id
  }

  public getCreatedOn(): Date {
    return this.createdOn
  }

  public getTitle(): string {
    return this.title
  }

  public setTitle(title: string): void {
    this.title = title
  }

  public getStatus(): TodoStatus {
    return this.status
  }

  public getHistory(): TodoStatusHistoryItem[] {
    return this.history
  }
  public toggleStatus() {
    this.status === TodoStatus.UNDONE ? this.markAsDone() : this.markAsUndone()
  }

  public markAsDone(): void {
    this.updateStatus(TodoStatus.DONE)
  }

  public markAsUndone(): void {
    this.updateStatus(TodoStatus.UNDONE)
  }
  public toJSON(): object {
    return {
      id: this.id,
      createdOn: this.createdOn,
      title: this.title,
      status: this.status,
      history: this.history,
    }
  }

  public static fromJSON(data: any): Todo {
    const todo = new Todo(data.title)
    todo.createdOn = data.createdOn
    todo.status = data.status
    todo.history = data.history
    return todo
  }

  private updateStatus(newStatus: TodoStatus): void {
    if (this.status !== newStatus) {
      const historyItem: TodoStatusHistoryItem = {
        changedOn: new Date(),
        oldStatus: this.status,
        newStatus: newStatus,
      }
      this.history.push(historyItem)
      this.status = newStatus
    }
  }
}

export enum TodoStatus {
  DONE = 'done',
  UNDONE = 'undone',
}

export interface TodoStatusHistoryItem {
  changedOn: Date
  oldStatus: TodoStatus
  newStatus: TodoStatus
}
