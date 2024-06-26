import * as React from 'react';
import { ToolbarButton, useReactMde } from '../components/index.js';
import {
  getBreaksNeededForEmptyLineAfter,
  getBreaksNeededForEmptyLineBefore,
  selectWord,
} from '../util/MarkdownUtil.js';

const CodeCommand = () => {
  const { getTextState, textApi, getIcon } = useReactMde();

  return (
    <ToolbarButton
      name="code"
      aria-label="Insert code"
      onClick={() => {
        const initialState = getTextState();

        // Adjust the selection to encompass the whole word if the caret is inside one
        const newSelectionRange = selectWord({
          text: initialState.text,
          selection: initialState.selection,
        });
        const state1 = textApi.setSelectionRange(newSelectionRange);

        // when there's no breaking line
        if (state1.selectedText.indexOf('\n') === -1) {
          textApi.replaceSelection(`\`${state1.selectedText}\``);
          // Adjust the selection to not contain the **

          const selectionStart = state1.selection.start + 1;
          const selectionEnd = selectionStart + state1.selectedText.length;

          textApi.setSelectionRange({
            start: selectionStart,
            end: selectionEnd,
          });
          return;
        }

        const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(
          state1.text,
          state1.selection.start
        );
        const breaksBefore = Array(breaksBeforeCount + 1).join('\n');

        const breaksAfterCount = getBreaksNeededForEmptyLineAfter(
          state1.text,
          state1.selection.end
        );
        const breaksAfter = Array(breaksAfterCount + 1).join('\n');

        textApi.replaceSelection(
          `${breaksBefore}\`\`\`\n${state1.selectedText}\n\`\`\`${breaksAfter}`
        );

        const selectionStart = state1.selection.start + breaksBeforeCount + 4;
        const selectionEnd = selectionStart + state1.selectedText.length;

        textApi.setSelectionRange({
          start: selectionStart,
          end: selectionEnd,
        });
      }}>
      {getIcon('code')}
    </ToolbarButton>
  );
};

export default CodeCommand;
