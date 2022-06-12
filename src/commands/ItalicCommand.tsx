import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { ToolbarButton, useReactMde } from '../components';
import { selectWord } from '../util/MarkdownUtil';

const ItalicCommand = () => {
  const { getTextState, textApi, getIcon, registerEventHandler } = useReactMde();

  const onClick = useCallback(() => {
    const initialState = getTextState();
    // Adjust the selection to encompass the whole word if the caret is inside one
    const newSelectionRange = selectWord({
      text: initialState.text,
      selection: initialState.selection,
    });
    const state1 = textApi.setSelectionRange(newSelectionRange);
    // Replaces the current selection with the italic mark up
    const state2 = textApi.replaceSelection(`*${state1.selectedText}*`);
    // Adjust the selection to not contain the *
    textApi.setSelectionRange({
      start: state2.selection.end - 1 - state1.selectedText.length,
      end: state2.selection.end - 1,
    });
  }, []);

  useEffect(() => {
    registerEventHandler({
      filter: (e) => {
        const { ctrlKey, metaKey, key } =
          e as React.KeyboardEvent<HTMLTextAreaElement>;
        return (ctrlKey || metaKey) && key === 'i';
      },
      handler: onClick,
    });
  }, [onClick]);

  return (
    <ToolbarButton name="italic" aria-label="Add italic text" onClick={onClick}>
      {getIcon('italic')}
    </ToolbarButton>
  );
};

export default ItalicCommand;
