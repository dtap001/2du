import prompts from 'prompts';
import { Fzf } from 'fzf';
import promptSync from 'prompt-sync';

export class UserInteractor {
    static async selectFromList(
      question: string,
      list: string[]
    ): Promise<string> {
      const choices = list.map((item: string) => {
        return { title: item, value: item } as prompts.Choice;
      });
  
      const fzf = new Fzf(list);
      const result = await prompts({
        type: 'autocomplete',
        name: 'value',
        message: question,
        choices: choices,
        suggest: (input: string) =>
          Promise.resolve(fzf.find(input).map((item) => item.item)),
      });
      return result.value;
    }
  
    static prompt(
      question: string,
      validation: (input: string) => boolean
    ): string {
      let result;
      do {
        const promptInstance = promptSync({ sigint: true });
        result = promptInstance(question);
      } while (!validation(result));
      return result;
    }
  }
  