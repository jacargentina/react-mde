// @flow
import * as React from 'react';
import { getDefaultCommandMap, L18n, TextApi, TextState } from '..';
import { insertText } from '../util/InsertTextAtPosition';
import { extractKeyActivatedCommands } from './command-utils';
import { getDefaultSaveImageCommandName } from './default-commands/defaults';

export class TextAreaTextApi implements TextApi {
  textAreaRef: null | HTMLTextAreaElement;

  constructor(textAreaRef: null | HTMLTextAreaElement) {
    this.textAreaRef = textAreaRef;
  }

  replaceSelection(text: string): TextState {
    const textArea = this.textAreaRef;
    insertText(textArea, text);
    return getStateFromTextArea(textArea);
  }

  setSelectionRange(selection: Selection): TextState {
    const textArea = this.textAreaRef;
    if (textArea) {
      textArea.focus();
      textArea.selectionStart = selection.start;
      textArea.selectionEnd = selection.end;
    }
    return getStateFromTextArea(textArea);
  }

  getState(): TextState {
    const textArea = this.textAreaRef;
    return getStateFromTextArea(textArea);
  }
}

export function getStateFromTextArea(
  textArea: null | HTMLTextAreaElement
): TextState {
  return {
    selection: {
      start: textArea?.selectionStart,
      end: textArea?.selectionEnd
    },
    text: textArea?.value,
    selectedText: textArea?.value.slice(
      textArea?.selectionStart,
      textArea?.selectionEnd
    )
  };
}

export class CommandOrchestrator {
  textAreaRef: null | HTMLTextAreaElement;
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
    textArea: null | HTMLTextAreaElement,
    l18n?: L18n,
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
      initialState: getStateFromTextArea(this.textAreaRef),
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
  }
}
