import { SelectionRange, TextApi, TextState } from '../index.js';
import insertText from '../util/InsertTextAtPosition.js';

export default class TextAreaTextApi implements TextApi {
  textAreaRef: { current: null | HTMLTextAreaElement };
  getTextState: Function;

  constructor(
    getTextState: Function,
    textAreaRef: { current: null | HTMLTextAreaElement }
  ) {
    this.textAreaRef = textAreaRef;
    this.getTextState = getTextState;
  }

  replaceSelection(text: string): TextState {
    const textArea = this.textAreaRef.current;
    if (textArea) {
      insertText(textArea, text);
    }
    return this.getTextState(textArea);
  }

  setSelectionRange(selection: SelectionRange): TextState {
    const textArea = this.textAreaRef.current;
    if (textArea) {
      textArea.focus();
      textArea.selectionStart = selection.start;
      textArea.selectionEnd = selection.end;
    }
    return this.getTextState(textArea);
  }

  getState(): TextState {
    const textArea = this.textAreaRef.current;
    return this.getTextState(textArea);
  }
}
