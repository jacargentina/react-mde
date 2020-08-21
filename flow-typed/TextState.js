// @flow

export type TextState = {
  /**
   * All the text in the editor
   */
  text: string,

  /**
   * The text that is selected
   */
  selectedText: string,

  /**
   * The section of the text that is selected
   */
  selection: Selection,
};
