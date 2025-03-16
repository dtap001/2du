import { Todo } from './todo.bo';
import * as fs from 'fs';

export class PersistenceService {
  private filePath = 'todos.json';

  public load(): Todo[] {
    if (!fs.existsSync(this.filePath)) {
      return [];
    }
    const data = fs.readFileSync(this.filePath, 'utf-8');
    const parsedData = JSON.parse(data);
    return parsedData.map((item: any) => Todo.fromJSON(item));
  }

  public save(todos: Todo[]): void {
    const data = JSON.stringify(
      todos.map((todo) => todo.toJSON()),
      null,
      2
    );
    fs.writeFileSync(this.filePath, data, 'utf-8');
  }
}
