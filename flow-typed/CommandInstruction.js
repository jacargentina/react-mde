// @flow

declare export var INSERT_TEXT_AT_CURSOR: any;

declare export var SELECT_RANGE: any;

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
