import * as React from 'react';
import { ToolbarButton, useReactMde } from '../components';
import { selectWord } from '../util/MarkdownUtil';

const StrikeThroughCommand = () => {
  const { getTextState, textApi, getIcon } = useReactMde();

  return (
    <ToolbarButton
      name="strikethrough"
      aria-label="Add strikethrough text"
      onClick={() => {
        const initialState = getTextState();
        const newSelectionRange = selectWord({
          text: initialState.text,
          selection: initialState.selection,
        });
        const state1 = textApi.setSelectionRange(newSelectionRange);
        // Replaces the current selection with the strikethrough mark up
        const state2 = textApi.replaceSelection(`~~${state1.selectedText}~~`);
        // Adjust the selection to not contain the ~~
        textApi.setSelectionRange({
          start: state2.selection.end - 2 - state1.selectedText.length,
          end: state2.selection.end - 2,
        });
      }}>
      {getIcon('strikethrough')}
    </ToolbarButton>
  );
};

export default StrikeThroughCommand;
