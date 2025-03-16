import { Logger } from './log.js'
import { Persistence } from './persistence.js'
import { Todo } from './todo.js'

export class TodoManager {
  static get(): Todo[] {
    const todos = Persistence.load()
    Logger.info(`TodoManager get: ${JSON.stringify(todos, undefined, 2)}`)
    return todos
  }

  static set(todos: Todo[]) {
    Logger.info(`TodoManager set: ${JSON.stringify(todos, undefined, 2)}`)
    Persistence.save(todos)
  }

  static create(title: string) {
    const newArray = this.get()
    newArray.push(new Todo(title))
    this.set(newArray)
  }
}
