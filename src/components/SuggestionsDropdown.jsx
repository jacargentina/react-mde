// @flow
import * as React from 'react';
import { useCallback } from 'react';

export type SuggestionsDropdownProps = {
  caret: CaretCoordinates,
  suggestions: Suggestion[],
  onSuggestionSelected: (index: number) => void,
  /**
   * Which item is focused by the keyboard
   */
  focusIndex: number,
  textAreaRef: null | HTMLTextAreaElement
};

export const SuggestionsDropdown = (props: SuggestionsDropdownProps) => {
  const {
    suggestions,
    caret,
    onSuggestionSelected,
    focusIndex,
    textAreaRef
  } = props;
  const handleSuggestionClick = useCallback(
    (event: SyntheticMouseEvent<any>) => {
      event.preventDefault();
      const index = parseInt(
        event.currentTarget.attributes['data-index'].value
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
      style={{
        left: caret.left - (textAreaRef ? textAreaRef.scrollLeft : 0),
        top: caret.top - (textAreaRef ? textAreaRef.scrollTop : 0)
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
            border: 1px solid $mde-border-color;
            border-radius: 3px;
            box-shadow: 0 1px 5px rgba(27, 31, 35, 0.15);
          }

          li {
            padding: 4px 8px;
            border-bottom: 1px solid #e1e4e8;
          }

          li:first-child {
            border-top-left-radius: $mde-border-radius;
            border-top-right-radius: $mde-border-radius;
          }

          li:last-child {
            border-bottom-right-radius: $mde-border-radius;
            border-bottom-left-radius: $mde-border-radius;
          }

          li:hover,
          li[aria-selected='true'] {
            color: $mde-white-color;
            background-color: $mde-selected-color;
          }
        `}
      </style>
      {suggestions.map((s, i) => (
        <li
          onClick={handleSuggestionClick}
          onMouseDown={handleMouseDown}
          key={i}
          aria-selected={focusIndex === i ? 'true' : 'false'}
          data-index={`${i}`}>
          {s.preview}
        </li>
      ))}
    </ul>
  );
};
