export type CaretCoordinates = {
  top: number;
  left: number;
  lineHeight: number;
};

export type TextAreaChildProps = { [key: string]: any };

export interface ChildProps {
  textArea?: TextAreaChildProps;
}

export type GetIcon = (iconName: string) => React.ReactNode;

export type UploadFileHandler = (
  data: ArrayBuffer,
  name: string
) => AsyncGenerator<string, boolean, void>;

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
export * from './commands';
export * from './components';
