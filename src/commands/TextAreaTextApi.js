// @flow
import { insertText } from '../util/InsertTextAtPosition';
import { getStateFromTextArea } from './command-utils';

export default class TextAreaTextApi implements TextApi {
  textAreaRef: { current: null | HTMLTextAreaElement };

  constructor(textAreaRef: { current: null | HTMLTextAreaElement }) {
    this.textAreaRef = textAreaRef;
  }

  replaceSelection(text: string): TextState {
    const textArea = this.textAreaRef.current;
    insertText(textArea, text);
    return getStateFromTextArea(textArea);
  }

  setSelectionRange(selection: Selection): TextState {
    const textArea = this.textAreaRef.current;
    if (textArea) {
      textArea.focus();
      textArea.selectionStart = selection.start;
      textArea.selectionEnd = selection.end;
    }
    return getStateFromTextArea(textArea);
  }

  getState(): TextState {
    const textArea = this.textAreaRef.current;
    return getStateFromTextArea(textArea);
  }
}
