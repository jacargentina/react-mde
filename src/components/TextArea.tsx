import * as React from 'react';
import { useState, useRef } from 'react';
import getCaretCoordinates from '../util/TextAreaCaretPosition';
import insertText from '../util/InsertTextAtPosition';
import mod from '../util/Math';
import { SuggestionsDropdown } from './SuggestionsDropdown';
import { CaretCoordinates, Suggestion } from '..';
import { useReactMde } from './ReactMdeContext';

export type MentionState = {
  status: 'active' | 'inactive' | 'loading';
  /**
   * Selection start by the time the mention was activated
   */
  startPosition: number;
  focusIndex: number;
  caret: CaretCoordinates;
  suggestions: Suggestion[];
  /**
   * The character that triggered the mention. Example: @
   */
  triggeredBy: string;
};

export type TextAreaProps = {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  suggestionTriggerCharacters?: string[];
  loadSuggestions?: (
    text: string,
    triggeredBy: string
  ) => Promise<Suggestion[]>;

  /**
   * Custom textarea component. "textAreaComponent" can be any React component which
   * props are a subset of the props of an HTMLTextAreaElement
   */
  textAreaComponent?: any;
  toolbarButtonComponent?: any;
  textAreaProps?: any;
  maximized?: boolean;
  minHeight?: number;
};

const initialMention: MentionState = {
  status: 'inactive',
  suggestions: [],
  triggeredBy: '',
  focusIndex: 0,
  startPosition: 0,
  caret: { top: 0, left: 0, lineHeight: 0 },
};

export const TextArea = (props: TextAreaProps) => {
  const { textarea, handlePossibleEvent } = useReactMde();
  const {
    readOnly,
    textAreaProps,
    value,
    suggestionTriggerCharacters,
    loadSuggestions,
    textAreaComponent,
    maximized = false,
    minHeight,
  } = props;

  const currentLoadSuggestionsPromise = useRef<Promise<any>>(Promise.resolve());
  const [mention, setMention] = useState<MentionState>(initialMention);

  /**
   * suggestionsPromiseIndex exists as a means to cancel what happens when the suggestions promise finishes loading.
   *
   * When the user is searching for suggestions, there is a promise that, when resolved, causes a re-render.
   * However, in case there is another promise to be resolved after the current one, it does not make sense to re-render
   * only to re-render again after the next one is complete.
   *
   * When there is a promise loading and the user cancels the suggestion, you don't want the status to go back to "active"
   * when the promise resolves.
   *
   * suggestionsPromiseIndex increments every time the mentions query
   */
  const suggestionsPromiseIndex = useRef<number>(0);

  const suggestionsEnabled = () => {
    return (
      suggestionTriggerCharacters &&
      suggestionTriggerCharacters.length &&
      loadSuggestions
    );
  };

  const getTextArea = (): HTMLTextAreaElement => {
    if (!textarea.current) {
      throw new Error('TextArea not found');
    }
    return textarea.current;
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { onChange } = props;
    onChange(event.target.value);
  };

  const clearMention = () => {
    setMention(initialMention);
  };

  const handleBlur = () => {
    if (mention) {
      clearMention();
    }
  };

  const startLoadingSuggestions = (text: string) => {
    if (!loadSuggestions) {
      return;
    }
    suggestionsPromiseIndex.current += 1;
    const promiseIndex = suggestionsPromiseIndex.current;
    currentLoadSuggestionsPromise.current =
      currentLoadSuggestionsPromise.current
        .then(() => loadSuggestions(text, mention.triggeredBy))
        .then((suggestions) => {
          // if (mention.status === 'inactive') {
          //   // This means this promise resolved too late when the status has already been set to inactice
          //   return;
          // }
          if (suggestionsPromiseIndex.current === promiseIndex) {
            if (!suggestions || !suggestions.length) {
              clearMention();
            } else {
              setMention((prev) => ({
                ...prev,
                status: 'active',
                suggestions,
                focusIndex: 0,
              }));
            }
            suggestionsPromiseIndex.current = 0;
          }
        });
  };

  const loadEmptySuggestion = (target: HTMLTextAreaElement, key: string) => {
    const caret = getCaretCoordinates(target, key);
    startLoadingSuggestions('');
    setMention({
      status: 'loading',
      focusIndex: 0,
      startPosition: target.selectionStart + 1,
      caret,
      suggestions: [],
      triggeredBy: key,
    });
  };

  const handleSuggestionSelected = (index: number) => {
    getTextArea().selectionStart = mention.startPosition - 1;
    // TODO
    // unused variable?
    const textForInsert = props.value.substr(
      getTextArea().selectionStart,
      getTextArea().selectionEnd - getTextArea().selectionStart
    );

    insertText(getTextArea(), `${mention.suggestions[index].value} `);
    clearMention();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const handled = handlePossibleEvent(event);
    if (handled) {
      event.preventDefault();
      // If the keydown resulted in a command being executed, we will just close the suggestions if they are open.
      // Resetting suggestionsPromiseIndex will cause any promise that is yet to be resolved to have no effect
      // when they finish loading.
      // TODO: The code below is duplicate, we need to clean this up
      suggestionsPromiseIndex.current = 0;
      clearMention();
      return;
    }

    if (!suggestionsEnabled()) {
      return;
    }

    const { key, shiftKey, currentTarget } = event;
    const { selectionStart } = currentTarget;

    switch (mention.status) {
      case 'loading':
      case 'active':
        if (
          key === 'Escape' ||
          (key === 'Backspace' && selectionStart <= mention.startPosition)
        ) {
          // resetting suggestionsPromiseIndex will cause any promise that is yet to be resolved to have no effect
          // when they finish loading.
          suggestionsPromiseIndex.current = 0;
          clearMention();
        } else if (
          mention.status === 'active' &&
          (key === 'ArrowUp' || key === 'ArrowDown') &&
          !shiftKey
        ) {
          event.preventDefault();
          const focusDelta = key === 'ArrowUp' ? -1 : 1;
          setMention((prev) => ({
            ...prev,
            focusIndex: mod(
              mention.focusIndex + focusDelta,
              mention.suggestions.length
            ),
          }));
        } else if (
          key === 'Enter' &&
          mention.status === 'active' &&
          mention.suggestions.length
        ) {
          event.preventDefault();
          handleSuggestionSelected(mention.focusIndex);
        }
        break;
      default:
      // Ignore
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { key } = event;

    switch (mention.status) {
      case 'loading':
      case 'active':
        if (key === 'Backspace') {
          const searchText = value.substr(
            mention.startPosition,
            getTextArea().selectionStart - mention.startPosition
          );

          startLoadingSuggestions(searchText);
          if (mention.status !== 'loading') {
            setMention((prev) => ({
              ...prev,
              status: 'loading',
            }));
          }
        }
        break;
      case 'inactive':
        if (key === 'Backspace') {
          const prevChar = value.charAt(getTextArea().selectionStart - 1);
          const isAtMention =
            suggestionTriggerCharacters &&
            suggestionTriggerCharacters.includes(
              value.charAt(getTextArea().selectionStart - 1)
            );

          if (isAtMention) {
            loadEmptySuggestion(event.currentTarget, prevChar);
          }
        }
        break;
      default:
      // Ignore
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { key } = event;

    switch (mention.status) {
      case 'loading':
      case 'active':
        {
          if (key === ' ') {
            setMention((prev) => ({
              ...prev,
              status: 'inactive',
            }));
            return;
          }

          const searchText =
            value.substr(
              mention.startPosition,
              getTextArea().selectionStart - mention.startPosition
            ) + key;

          // In this case, the mentions box was open but the user typed something else
          startLoadingSuggestions(searchText);
          if (mention.status !== 'loading') {
            setMention((prev) => ({
              ...prev,
              status: 'loading',
            }));
          }
        }
        break;
      case 'inactive':
        if (
          (suggestionTriggerCharacters &&
            suggestionTriggerCharacters.indexOf(event.key) === -1) ||
          !/\s|\(|\[|^.{0}$/.test(
            value.charAt(getTextArea().selectionStart - 1)
          )
        ) {
          return;
        }

        loadEmptySuggestion(event.currentTarget, event.key);
        break;
      default:
        break;
    }
  };

  const TextAreaComponent = textAreaComponent || 'textarea';

  return (
    <div
      className="react-mde-textarea"
      style={{
        resize: maximized ? 'none' : 'vertical',
        minHeight: minHeight || 'auto',
      }}>
      <TextAreaComponent
        className="textarea"
        ref={textarea}
        readOnly={readOnly}
        value={value}
        data-testid="text-area"
        {...textAreaProps}
        onChange={(event) => {
          textAreaProps?.onChange?.(event);
          handleOnChange(event);
        }}
        onBlur={(event) => {
          if (suggestionsEnabled()) {
            textAreaProps?.onBlur?.(event);
            handleBlur();
          }
        }}
        onKeyDown={(event) => {
          textAreaProps?.onKeyDown?.(event);
          handleKeyDown(event);
        }}
        onKeyUp={(event) => {
          if (suggestionsEnabled()) {
            textAreaProps?.onKeyUp?.(event);
            handleKeyUp(event);
          }
        }}
        onKeyPress={(event) => {
          if (suggestionsEnabled()) {
            textAreaProps?.onKeyPress?.(event);
            handleKeyPress(event);
          }
        }}
        onPaste={(event) => {
          if (handlePossibleEvent(event)) {
            event.preventDefault();
          }
        }}
        onDrop={(event) => {
          if (handlePossibleEvent(event)) {
            event.preventDefault();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      />
      {mention.status === 'active' && mention.suggestions.length && (
        <SuggestionsDropdown
          caret={mention.caret}
          suggestions={mention.suggestions}
          onSuggestionSelected={handleSuggestionSelected}
          focusIndex={mention.focusIndex}
          textAreaRef={textarea.current}
        />
      )}
    </div>
  );
};
