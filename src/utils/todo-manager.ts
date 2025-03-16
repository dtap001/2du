import { Logger } from './log.js'
import { Todo } from './todo.js'
import * as fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

export class TodoManager {
  private static todos: Todo[] = []
  private static filePath = '/tmp/2dus.json'
  private static onUpdateCallback: (() => void) | null = null

  public static get() {
    const todosx = this.load()
    this.todos.length = 0
    this.todos.push(...todosx)
    return this.todos
  }

  private static load(): Todo[] {
    Logger.info(`Persistence.load: ${this.filePath}`)
    if (!fs.existsSync(this.filePath)) {
      return []
    }
    const data = fs.readFileSync(this.filePath, 'utf-8')
    const parsedData = JSON.parse(data)
    return parsedData.map((item: any) => Todo.fromJSON(item, this.onChanged))
  }

  private static save(): void {
    Logger.info(`Persistence.save: ${this.filePath}`)

    const data = JSON.stringify(
      this.todos.map((todo) => todo.toJSON()),
      null,
      2,
    )
    Logger.info(data)
    fs.writeFileSync(this.filePath, data, 'utf-8')
    if (this.onUpdateCallback) {
      this.onUpdateCallback()
    }
  }

  static create(title: string) {
    this.todos.push(new Todo(uuidv4(), title, this.onChanged))
    this.save()
  }

  static delete(id?: string) {
    Logger.info(`TodoManager delete id: ${id}`)
    this.todos = [...this.todos.filter((item) => item.getId() !== id)]
    TodoManager.save()
  }

  private static onChanged(item: Todo) {
    // const allButChanged = this.todos.filter(
    //   (item) => item.getId() === item.getId(),
    // )
    // this.todos = [...allButChanged, item]
    Logger.info(
      `TodoManager.onChanged item:${JSON.stringify(
        item,
        undefined,
        2,
      )} todos: ${JSON.stringify(this.todos, undefined, 2)}`,
    )
    TodoManager.save()
  }

  public static setOnUpdate(callback: () => void) {
    this.onUpdateCallback = callback
  }
}
