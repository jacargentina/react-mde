// @flow
import * as React from "react";
import { selectWord } from "../../util/MarkdownUtil";

export const imageCommand: Command = {
  buttonProps: { "aria-label": "Add image" },
  execute: ({ initialState, textApi }) => {
    // Replaces the current selection with the whole word selected
    const state1 = textApi.setSelectionRange(
      selectWord({
        text: initialState.text,
        selection: initialState.selection
      })
    );
    // Replaces the current selection with the image
    const imageTemplate =
      state1.selectedText || "https://example.com/your-image.png";
    textApi.replaceSelection(`![](${imageTemplate})`);
    // Adjust the selection to not contain the **
    textApi.setSelectionRange({
      start: state1.selection.start + 4,
      end: state1.selection.start + 4 + imageTemplate.length
    });
  }
};
