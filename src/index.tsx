export type CaretCoordinates = {
  top: number;
  left: number;
  lineHeight: number;
};

export type ButtonChildProps = { [key: string]: any };

export type TextAreaChildProps = { [key: string]: any };

export interface ChildProps {
  writeButton?: ButtonChildProps;
  previewButton?: ButtonChildProps;
  commandButtons?: ButtonChildProps;
  textArea?: TextAreaChildProps;
}

export type GetIcon = (iconName: string) => React.ReactNode;

export type UploadFileHandler = (
  data: ArrayBuffer,
  name: string
) => AsyncGenerator<string, boolean, void>;

export type CommandContext = {
  event?:
    | React.ClipboardEvent<HTMLTextAreaElement>
    | React.DragEvent<HTMLTextAreaElement>
    | React.ChangeEvent<HTMLInputElement>;
  uploadFile?: UploadFileHandler;
};

export type ExecuteOptions = {
  initialState: TextState;
  textApi: TextApi;
  context: CommandContext;
  l18n?: L18n;
};

export type Command = {
  buttonComponentClass?: React.Component<any> | string;
  icon?: (getIconFromProvider: GetIcon) => React.ReactNode;
  title?: string;
  buttonProps?: any;
  execute(options: ExecuteOptions): Promise<any> | void;

  /**
   * On every key-down, "handleKeyCommand", if defined, will be executed for every command.
   * The first "HandleKeyCommand" that returns true will cause the command to be executed.
   * "HandleKeyCommand" for subsequent commands will not be executed after the first one returns true.
   */
  handleKeyCommand?: HandleKeyCommand;
};

export type ToolbarGroup = {
  name: string;
  dropdownContent?: React.ReactNode;
  dropdownProps?: ButtonChildProps;
  items: string[];
};

export type ToolbarGroups = ToolbarGroup[];

export type ToolbarRenderData = {
  commandName: string;
  buttonContent: React.ReactNode;
  buttonProps: any;
  buttonComponentClass: any;
};

export type ToolbarRenderGroup = {
  name: string;
  dropdownContent?: React.ReactNode;
  dropdownProps?: ButtonChildProps;
  items: ToolbarRenderData[];
};

export type ToolbarRenderGroups = ToolbarRenderGroup[];

export type CommandMap = { [key: string]: Command };

export type PasteOptions = {
  /**
   * Generator function to save files pasted.
   * This generator should 1) Yield the file URL. 2) Return true if the save was successful or false, otherwise
   */
  uploadFile: UploadFileHandler;

  /**
   * Command to execute on paste command
   */
  command?: string;
};

declare var INSERT_TEXT_AT_CURSOR: any;

declare var SELECT_RANGE: any;

export interface InsertTextAtCursorInstruction {
  type: typeof INSERT_TEXT_AT_CURSOR;
  text: string;
}

export interface SelectRangeInstruction {
  type: typeof SELECT_RANGE;
  selectionStart: number;
  selectionEnd: number;
}

export type Instruction =
  | InsertTextAtCursorInstruction
  | SelectRangeInstruction;

/**
 * The state of the text of the whole editor
 */
export interface TextApi {
  /**
   * Replaces the current selection with the new text. This will make the new selectedText to be empty, the
   * selection start and selection end will be the same and will both point to the end
   * @param text Text that should replace the current selection
   */
  replaceSelection(text: string): TextState;

  /**
   * Selects the specified text range
   * @param selection
   */
  setSelectionRange(selection: SelectionRange): TextState;

  /**
   * Get the current text state
   */
  getState(): TextState;
}

export type GenerateMarkdownPreview = (
  markdown: string
) => Promise<React.ReactNode>;

/**
 * If the command returns true for a given KeyboardEvent,
 * the command is executed
 */
export type HandleKeyCommand = (
  e: React.KeyboardEvent<HTMLTextAreaElement>
) => boolean;

export interface L18n {
  write: React.ReactNode;
  preview: React.ReactNode;
  uploadingFile: string;
  pasteDropSelect: string;
}

export interface MarkdownState {
  selection: SelectionRange;
  text: string;
}

export type RefObj<ElementType> = { current: null | ElementType };

export interface Refs {
  textarea?: RefObj<HTMLTextAreaElement>;
  preview?: RefObj<HTMLDivElement>;
}

export type SelectionRange = {
  start: number;
  end: number;
};

export interface Suggestion {
  /**
   * React element to be used as the preview
   */
  preview: React.ReactNode;

  /**
   * Value that is going to be used in the text in case this suggestion is selected
   */
  value: string;
}

export type Tab = 'write' | 'preview';

export type TextSection = {
  text: string;
  selection: SelectionRange;
};
export type TextState = {
  /**
   * All the text in the editor
   */
  text: string;

  /**
   * The text that is selected
   */
  selectedText: string;

  /**
   * The section of the text that is selected
   */
  selection: SelectionRange;
};

export * as MarkdownUtil from './util/MarkdownUtil';
export { TextArea, SuggestionsDropdown, Preview, Toolbar } from './components';
export {
  getDefaultCommandMap,
  getDefaultToolbarCommands,
} from './commands/default-commands/defaults';

import { ReactMde } from './components';
export default ReactMde;
