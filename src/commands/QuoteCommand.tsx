import * as React from 'react';
import { ToolbarButton, useReactMde } from '../components/index.js';
import {
  getBreaksNeededForEmptyLineAfter,
  getBreaksNeededForEmptyLineBefore,
  selectWord,
} from '../util/MarkdownUtil.js';

const QuoteCommand = () => {
  const { getTextState, textApi, getIcon } = useReactMde();

  return (
    <ToolbarButton
      name="quote"
      aria-label="Insert a quote"
      onClick={() => {
        const initialState = getTextState();
        // Adjust the selection to encompass the whole word if the caret is inside one
        const newSelectionRange = selectWord({
          text: initialState.text,
          selection: initialState.selection,
        });
        const state1 = textApi.setSelectionRange(newSelectionRange);

        const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(
          state1.text,
          state1.selection.start,
        );
        const breaksBefore = Array(breaksBeforeCount + 1).join('\n');

        const breaksAfterCount = getBreaksNeededForEmptyLineAfter(
          state1.text,
          state1.selection.end,
        );
        const breaksAfter = Array(breaksAfterCount + 1).join('\n');

        // Replaces the current selection with the quote mark up
        textApi.replaceSelection(
          `${breaksBefore}> ${state1.selectedText}${breaksAfter}`,
        );

        const selectionStart = state1.selection.start + breaksBeforeCount + 2;
        const selectionEnd = selectionStart + state1.selectedText.length;

        textApi.setSelectionRange({
          start: selectionStart,
          end: selectionEnd,
        });
      }}>
      {getIcon('quote')}
    </ToolbarButton>
  );
};

export default QuoteCommand;
