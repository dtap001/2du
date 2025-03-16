import { Logger } from './log.js'

export class Todo {
  private id: string
  private createdOn: Date
  private title: string
  private status: TodoStatus
  private history: TodoStatusHistoryItem[]
  private onChanged: any
  private isHidden: boolean

  constructor(id: string, title: string, onChanged: any) {
    this.id = id
    this.onChanged = onChanged
    this.createdOn = new Date()
    this.title = title
    this.status = TodoStatus.UNDONE
    this.history = []
    this.isHidden = false
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

  public getIsHidden() {
    return this.isHidden
  }

  public toggleHidden() {
    Logger.info('isHidden:' + this.isHidden)
    this.isHidden = this.isHidden ? false : true
    Logger.info('isHidden:' + this.isHidden)

    this.onChanged(this)
  }

  public getStatus(): TodoStatus {
    return this.status
  }
  public getSummary() {
    return ` ${
      this.getStatus() === TodoStatus.DONE ? '[✔]' : '[ ]'
    } ${this.getCreatedOn().toLocaleDateString()} ${this.getTitle()}`
  }

  public getHistory(): TodoStatusHistoryItem[] {
    return this.history
  }
  public toggleStatus() {
    this.status === TodoStatus.UNDONE
      ? this.updateStatus(TodoStatus.DONE)
      : this.updateStatus(TodoStatus.UNDONE)
    this.onChanged(this)
  }

  public toJSON(): object {
    return {
      id: this.id,
      createdOn: this.createdOn,
      title: this.title,
      status: this.status,
      history: this.history,
      isHidden: this.isHidden,
    }
  }

  public static fromJSON(data: any, onChanged: any): Todo {
    const todo = new Todo(data.id, data.title, onChanged)
    todo.createdOn = new Date(data.createdOn)
    todo.status = data.status
    todo.history = data.history
    todo.isHidden = data.isHidden
    return todo
  }

  private updateStatus(newStatus: TodoStatus): void {
    if (this.status !== newStatus) {
      const historyItem: TodoStatusHistoryItem = {
        changedOn: new Date(),
        oldStatus: this.status,
        newStatus: newStatus,
      }
      this.history = []
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
