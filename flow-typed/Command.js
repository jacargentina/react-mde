// @flow
import * as React from 'react';

export type GetIcon = (iconName: string) => React.Node;

export type SaveImageHandler = (
  data: ArrayBuffer
) => AsyncGenerator<string, boolean, void>;

export type CommandContext = {
  // eslint-disable-next-line
  event?:
    | SyntheticClipboardEvent<HTMLTextAreaElement>
    | SyntheticDragEvent<HTMLTextAreaElement>
    | SyntheticInputEvent<HTMLTextAreaElement>,
  saveImage?: SaveImageHandler,
};

export type ExecuteOptions = {
  initialState: TextState,
  textApi: TextApi,
  context: CommandContext,
  l18n?: L18n,
};

export type Command = {
  buttonComponentClass?: React.Component<> | string,
  icon?: (getIconFromProvider: GetIcon) => React.Node,
  title?: string,
  buttonProps?: any,
  execute(options: ExecuteOptions): ?Promise<void>,

  /**
   * On every key-down, "handleKeyCommand", if defined, will be executed for every command.
   * The first "HandleKeyCommand" that returns true will cause the command to be executed.
   * "HandleKeyCommand" for subsequent commands will not be executed after the first one returns true.
   */
  handleKeyCommand?: HandleKeyCommand,
};

export type ToolbarGroup = {
  name: string,
  dropdownContent?: React.Node,
  dropdownProps?: ButtonChildProps,
  items: string[],
};

export type ToolbarGroups = ToolbarGroup[];

export type ToolbarRenderData = {
  commandName: string,
  buttonContent: React.Node,
  buttonProps: any,
  buttonComponentClass: any,
};

export type ToolbarRenderGroup = {
  name: string,
  dropdownContent?: React.Node,
  dropdownProps?: ButtonChildProps,
  items: ToolbarRenderData[],
};

export type ToolbarRenderGroups = ToolbarRenderGroup[];

export type CommandMap = { [key: string]: Command, ... };

export type PasteOptions = {
  /**
   * Generator function to save images pasted.
   * This generator should 1) Yield the image URL. 2) Return true if the save was successful or false, otherwise
   */
  saveImage: SaveImageHandler,

  /**
   * Command to execute on paste command
   */
  command?: string,
};
