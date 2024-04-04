import * as React from 'react';
import { ToolbarButton, useReactMde } from '../components/index.js';
import { TextApi, TextState } from '../index.js';
import {
  getBreaksNeededForEmptyLineAfter,
  getBreaksNeededForEmptyLineBefore,
  selectWord,
} from '../util/MarkdownUtil.js';

export type AlterLineFunction = (line: string, index: number) => string;

/**
 * Inserts insertionString before each line
 */
export function insertBeforeEachLine(
  selectedText: string,
  insertBefore: string | AlterLineFunction
): { modifiedText: string; insertionLength: number } {
  const lines = selectedText.split(/\n/);

  let insertionLength = 0;
  const modifiedText = lines
    .map((item, index) => {
      if (typeof insertBefore === 'string') {
        insertionLength += insertBefore.length;
        return insertBefore + item;
      }
      if (typeof insertBefore === 'function') {
        const insertionResult = insertBefore(item, index);
        insertionLength += insertionResult.length;
        return insertBefore(item, index) + item;
      }
      throw Error('insertion is expected to be either a string or a function');
    })
    .join('\n');

  return { modifiedText, insertionLength };
}

export const makeList = (
  state0: TextState,
  api: TextApi,
  insertBefore: string | AlterLineFunction
) => {
  // Adjust the selection to encompass the whole word if the caret is inside one
  const newSelectionRange = selectWord({
    text: state0.text,
    selection: state0.selection,
  });
  const state1 = api.setSelectionRange(newSelectionRange);

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

  const modifiedText = insertBeforeEachLine(state1.selectedText, insertBefore);

  api.replaceSelection(
    `${breaksBefore}${modifiedText.modifiedText}${breaksAfter}`
  );

  // Specifically when the text has only one line, we can exclude the "- ", for example, from the selection
  const oneLinerOffset =
    state1.selectedText.indexOf('\n') === -1 ? modifiedText.insertionLength : 0;

  const selectionStart =
    state1.selection.start + breaksBeforeCount + oneLinerOffset;
  const selectionEnd =
    selectionStart + modifiedText.modifiedText.length - oneLinerOffset;

  // Adjust the selection to not contain the **
  api.setSelectionRange({
    start: selectionStart,
    end: selectionEnd,
  });
};

export const UnorderedListCommand = () => {
  const { getTextState, textApi, getIcon } = useReactMde();

  return (
    <ToolbarButton
      name="unordered-list"
      aria-label="Add unordered list"
      onClick={() => {
        const initialState = getTextState();
        makeList(initialState, textApi, '- ');
      }}>
      {getIcon('unordered-list')}
    </ToolbarButton>
  );
};

export const OrderedListCommand = () => {
  const { getTextState, textApi, getIcon } = useReactMde();

  return (
    <ToolbarButton
      name="ordered-list"
      aria-label="Add ordered list"
      onClick={() => {
        const initialState = getTextState();
        makeList(initialState, textApi, (item, index) => `${index + 1}. `);
      }}>
      {getIcon('ordered-list')}
    </ToolbarButton>
  );
};

export const CheckedListCommand = () => {
  const { getTextState, textApi, getIcon } = useReactMde();

  return (
    <ToolbarButton
      name="checked-list"
      aria-label="Add checked list"
      onClick={() => {
        const initialState = getTextState();
        makeList(initialState, textApi, () => `- [ ] `);
      }}>
      {getIcon('checked-list')}
    </ToolbarButton>
  );
};
