// @flow
import * as React from 'react';

export interface ExecuteOptions {
  initialState: TextState;
  textApi: TextApi;
  context: CommandContext;
  l18n?: L18n;
}

export type GetIcon = (iconName: string) => React.Node;

export interface Command {
  buttonComponentClass?: React.Component<> | string;
  icon?: (getIconFromProvider: GetIcon) => React.Node;
  buttonProps?: any;
  execute(options: ExecuteOptions): ?Promise<void>;

  /**
   * On every key-down, "handleKeyCommand", if defined, will be executed for every command.
   * The first "HandleKeyCommand" that returns true will cause the command to be executed.
   * "HandleKeyCommand" for subsequent commands will not be executed after the first one returns true.
   */
  handleKeyCommand?: HandleKeyCommand;
}

export type SaveImageHandler = (
  data: ArrayBuffer
) => AsyncGenerator<string, boolean, void>;

export type CommandContext = {
  event?:
    | SyntheticClipboardEvent<HTMLTextAreaElement>
    | SyntheticDragEvent<HTMLTextAreaElement>
    | SyntheticInputEvent<HTMLTextAreaElement>,
  saveImage?: SaveImageHandler,
};

export type ToolbarCommands = string[][];

export type CommandMap = { [key: string]: Command, ... };

export interface PasteOptions {
  /**
   * Generator function to save images pasted.
   * This generator should 1) Yield the image URL. 2) Return true if the save was successful or false, otherwise
   */
  saveImage: SaveImageHandler;

  /**
   * Command to execute on paste command
   */
  command?: string;
}
