type CaretCoordinates = {
  top: number;
  left: number;
  lineHeight: number;
};

type ButtonChildProps = { [key: string]: any };

type TextAreaChildProps = { [key: string]: any };

interface ChildProps {
  writeButton?: ButtonChildProps;
  previewButton?: ButtonChildProps;
  commandButtons?: ButtonChildProps;
  textArea?: TextAreaChildProps;
}

type GetIcon = (iconName: string) => React.ReactNode;

type UploadFileHandler = (
  data: ArrayBuffer
) => AsyncGenerator<string, boolean, void>;

type CommandContext = {
  event?:
    | React.ClipboardEvent<HTMLTextAreaElement>
    | React.DragEvent<HTMLTextAreaElement>
    | React.ChangeEvent<HTMLInputElement>;
  uploadFile?: UploadFileHandler;
};

type ExecuteOptions = {
  initialState: TextState;
  textApi: TextApi;
  context: CommandContext;
  l18n?: L18n;
};

type Command = {
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

type ToolbarGroup = {
  name: string;
  dropdownContent?: React.ReactNode;
  dropdownProps?: ButtonChildProps;
  items: string[];
};

type ToolbarGroups = ToolbarGroup[];

type ToolbarRenderData = {
  commandName: string;
  buttonContent: React.ReactNode;
  buttonProps: any;
  buttonComponentClass: any;
};

type ToolbarRenderGroup = {
  name: string;
  dropdownContent?: React.ReactNode;
  dropdownProps?: ButtonChildProps;
  items: ToolbarRenderData[];
};

type ToolbarRenderGroups = ToolbarRenderGroup[];

type CommandMap = { [key: string]: Command };

type PasteOptions = {
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

interface InsertTextAtCursorInstruction {
  type: typeof INSERT_TEXT_AT_CURSOR;
  text: string;
}

interface SelectRangeInstruction {
  type: typeof SELECT_RANGE;
  selectionStart: number;
  selectionEnd: number;
}

type Instruction = InsertTextAtCursorInstruction | SelectRangeInstruction;

/**
 * The state of the text of the whole editor
 */
interface TextApi {
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

type GenerateMarkdownPreview = (markdown: string) => Promise<React.ReactNode>;

/**
 * If the command returns true for a given KeyboardEvent,
 * the command is executed
 */
type HandleKeyCommand = (
  e: React.KeyboardEvent<HTMLTextAreaElement>
) => boolean;

interface L18n {
  write: React.ReactNode;
  preview: React.ReactNode;
  uploadingFile: string;
  pasteDropSelect: string;
}

interface MarkdownState {
  selection: SelectionRange;
  text: string;
}

type RefObj<ElementType> = { current: null | ElementType };

interface Refs {
  textarea?: RefObj<HTMLTextAreaElement>;
  preview?: RefObj<HTMLDivElement>;
}

type SelectionRange = {
  start: number;
  end: number;
};

interface Suggestion {
  /**
   * React element to be used as the preview
   */
  preview: React.ReactNode;

  /**
   * Value that is going to be used in the text in case this suggestion is selected
   */
  value: string;
}

type Tab = 'write' | 'preview';

type TextSection = {
  text: string;
  selection: SelectionRange;
};
type TextState = {
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
