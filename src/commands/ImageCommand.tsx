import * as React from 'react';
import { ToolbarButton, useReactMde } from '../components/index.js';
import { selectWord } from '../util/MarkdownUtil.js';

const ImageCommand = () => {
  const { getTextState, textApi, getIcon } = useReactMde();

  return (
    <ToolbarButton
      name="image"
      aria-label="Add image"
      onClick={() => {
        const initialState = getTextState();
        // Replaces the current selection with the whole word selected
        const state1 = textApi.setSelectionRange(
          selectWord({
            text: initialState.text,
            selection: initialState.selection,
          })
        );
        // Replaces the current selection with the image
        const imageTemplate =
          state1.selectedText || 'https://example.com/your-image.png';
        textApi.replaceSelection(`![](${imageTemplate})`);
        // Adjust the selection to not contain the **
        textApi.setSelectionRange({
          start: state1.selection.start + 4,
          end: state1.selection.start + 4 + imageTemplate.length,
        });
      }}>
      {getIcon('image')}
    </ToolbarButton>
  );
};

export default ImageCommand;
