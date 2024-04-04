import * as React from 'react';
import { useCallback } from 'react';
import { CaretCoordinates, Suggestion } from '../index.js';

export type SuggestionsDropdownProps = {
  caret: CaretCoordinates;
  suggestions: Suggestion[];
  onSuggestionSelected: (index: number) => void;
  /**
   * Which item is focused by the keyboard
   */
  focusIndex: number;
  textAreaRef: null | HTMLTextAreaElement;
};

export const SuggestionsDropdown = (props: SuggestionsDropdownProps) => {
  const { suggestions, caret, onSuggestionSelected, focusIndex, textAreaRef } =
    props;

  const handleSuggestionClick = useCallback(
    (event: React.MouseEvent<any>) => {
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
    (event: React.MouseEvent<any>) => event.preventDefault(),
    []
  );

  return (
    <ul
      data-testid="suggestions"
      className="react-mde-sugesstions"
      style={{
        left: caret.left - (textAreaRef ? textAreaRef.scrollLeft : 0),
        top: caret.top - (textAreaRef ? textAreaRef.scrollTop : 0),
      }}
    >
      {suggestions.map((s, i) => (
        <li
          key={i}
          onClick={handleSuggestionClick}
          onMouseDown={handleMouseDown}
          aria-selected={focusIndex === i ? 'true' : 'false'}
          data-index={`${i}`}
        >
          {s.preview}
        </li>
      ))}
    </ul>
  );
};
