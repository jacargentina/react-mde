// @flow
import {
  getDefaultCommandMap,
  getDefaultSaveImageCommandName
} from './default-commands/defaults';
import {
  extractKeyActivatedCommands,
  getStateFromTextArea
} from './command-utils';
import TextAreaTextApi from './TextAreaTextApi';

export default class CommandOrchestrator {
  textAreaRef: { current: null | HTMLTextAreaElement };

  textApi: TextApi;

  commandMap: CommandMap;

  l18n: L18n;

  /**
   * Names of commands that can be activated by the keyboard
   */
  keyActivatedCommands: string[];

  /**
   * Indicates whether there is a command currently executing
   */
  isExecuting: boolean;

  pasteOptions: ?PasteOptions;

  constructor(
    customCommands: CommandMap,
    textArea: { current: null | HTMLTextAreaElement },
    l18n: L18n,
    pasteOptions?: PasteOptions
  ) {
    if (pasteOptions && !pasteOptions.saveImage) {
      throw new Error('paste options are incomplete. saveImage are required');
    }

    this.commandMap = { ...getDefaultCommandMap(), ...(customCommands || {}) };
    this.pasteOptions = pasteOptions;
    this.keyActivatedCommands = extractKeyActivatedCommands(customCommands);
    this.textAreaRef = textArea;
    this.textApi = new TextAreaTextApi(textArea);
    this.l18n = l18n;
  }

  getCommand(name: string): Command {
    const command = this.commandMap[name];
    if (!command) {
      throw new Error(`Cannot execute command. Command not found: ${name}`);
    }
    return command;
  }

  /**
   * Tries to find a command the wants to handle the keyboard event.
   * If a command is found, it is executed and the function returns
   */
  handlePossibleKeyCommand(
    e: SyntheticKeyboardEvent<HTMLTextAreaElement>
  ): boolean {
    for (const commandName of this.keyActivatedCommands) {
      const handler = this.getCommand(commandName).handleKeyCommand;
      if (handler && handler(e)) {
        this.executeCommand(commandName, {});
        return true;
      }
    }
    return false;
  }

  async executeCommand(
    commandName: string,
    context: CommandContext
  ): Promise<void> {
    if (this.isExecuting) {
      // The simplest thing to do is to ignore commands while
      // there is already a command executing. The alternative would be to queue commands
      // but there is no guarantee that the state after one command executes will still be compatible
      // with the next one. In fact, it is likely not to be.
      return;
    }

    this.isExecuting = true;
    const command = this.commandMap[commandName];
    const result = command.execute({
      initialState: getStateFromTextArea(this.textAreaRef.current),
      textApi: this.textApi,
      l18n: this.l18n,
      context
    });
    await result;
    this.isExecuting = false;
  }

  /**
   * Executes the paste command
   */
  async executePasteCommand(
    event: SyntheticClipboardEvent<HTMLTextAreaElement>
  ): Promise<void> {
    const options = this.pasteOptions;
    if (options) {
      return this.executeCommand(
        options.command || getDefaultSaveImageCommandName(),
        {
          saveImage: options.saveImage,
          event
        }
      );
    }
    return undefined;
  }

  /**
   * Executes the drop command
   */
  async executeDropCommand(
    event: SyntheticDragEvent<HTMLTextAreaElement>
  ): Promise<void> {
    const options = this.pasteOptions;
    if (options) {
      return this.executeCommand(
        options.command || getDefaultSaveImageCommandName(),
        {
          saveImage: options.saveImage,
          event
        }
      );
    }
    return undefined;
  }

  /**
   * Executes the "select image" command
   */
  async executeSelectImageCommand(
    event: SyntheticInputEvent<HTMLTextAreaElement>
  ): Promise<void> {
    const options = this.pasteOptions;
    if (options) {
      return this.executeCommand(
        options.command || getDefaultSaveImageCommandName(),
        {
          saveImage: options.saveImage,
          event
        }
      );
    }
    return undefined;
  }
}
