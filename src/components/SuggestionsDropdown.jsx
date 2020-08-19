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
      className={classNames('mde-suggestions', classes)}
      style={{
        left: caret.left - (textAreaRef ? textAreaRef.scrollLeft : 0),
        top: caret.top - (textAreaRef ? textAreaRef.scrollTop : 0)
      }}>
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
