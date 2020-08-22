// @flow
import * as React from 'react';
import { useCallback } from 'react';
import { colors, misc } from './theme';

export type SuggestionsDropdownProps = {
  caret: CaretCoordinates,
  suggestions: Suggestion[],
  onSuggestionSelected: (index: number) => void,
  /**
   * Which item is focused by the keyboard
   */
  focusIndex: number,
  textAreaRef: null | HTMLTextAreaElement,
};

export const SuggestionsDropdown = (props: SuggestionsDropdownProps) => {
  const {
    suggestions,
    caret,
    onSuggestionSelected,
    focusIndex,
    textAreaRef,
  } = props;

  const handleSuggestionClick = useCallback(
    (event: SyntheticMouseEvent<any>) => {
      event.preventDefault();
      const index = parseInt(
        event.currentTarget.attributes['data-index'].value,
        10
      );
      onSuggestionSelected(index);
    },
    [suggestions]
  );

  // onMouseDown should be cancelled because onClick will handle it propertly. This way, the textarea does not lose
  // focus
  const handleMouseDown = useCallback(
    (event: SyntheticMouseEvent<any>) => event.preventDefault(),
    []
  );

  return (
    <ul
      data-testid="suggestions"
      style={{
        left: caret.left - (textAreaRef ? textAreaRef.scrollLeft : 0),
        top: caret.top - (textAreaRef ? textAreaRef.scrollTop : 0),
      }}>
      <style jsx>
        {`
          ul {
            position: absolute;
            min-width: 180px;
            padding: 0;
            margin: 20px 0 0;
            list-style: none;
            cursor: pointer;
            background: #fff;
            border: 1px solid ${colors.border};
            border-radius: 3px;
            box-shadow: 0 1px 5px rgba(27, 31, 35, 0.15);
            z-index: 9999;
          }

          li {
            padding: 4px 8px;
            border-bottom: 1px solid #e1e4e8;
          }

          li:first-child {
            border-top-left-radius: ${misc.borderRadius};
            border-top-right-radius: ${misc.borderRadius};
          }

          li:last-child {
            border-bottom-right-radius: ${misc.borderRadius};
            border-bottom-left-radius: ${misc.borderRadius};
          }

          li:hover,
          li[aria-selected='true'] {
            color: ${colors.white};
            background-color: ${colors.selected};
          }
        `}
      </style>
      {suggestions.map((s, i) => (
        // eslint-disable-next-line
        <li
          key={s.preview}
          onClick={handleSuggestionClick}
          onMouseDown={handleMouseDown}
          aria-selected={focusIndex === i ? 'true' : 'false'}
          data-index={`${i}`}>
          {s.preview}
        </li>
      ))}
    </ul>
  );
};
