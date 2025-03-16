import * as fs from 'fs'
import { Todo } from './todo.js'
import { Logger } from './log.js'

export class Persistence {
  private static filePath = '/tmp/todos.json'

  public static load(): Todo[] {
    Logger.info(`Persistence.load: ${this.filePath}`)
    if (!fs.existsSync(this.filePath)) {
      return []
    }
    const data = fs.readFileSync(this.filePath, 'utf-8')
    const parsedData = JSON.parse(data)
    return parsedData.map((item: any) => Todo.fromJSON(item))
  }

  public static save(todos: Todo[]): void {
    Logger.info(`Persistence.save: ${this.filePath}`)

    const data = JSON.stringify(
      todos.map((todo) => todo.toJSON()),
      null,
      2,
    )
    fs.writeFileSync(this.filePath, data, 'utf-8')
  }
}
