/**
 * Returns a flat array of commands that can be activated by the keyboard.
 * When keydowns happen, these commands 'handleKeyCommand' will be executed, in this order,
 * and the first that returns true will be executed.
 */
export function extractKeyActivatedCommands(
  commandMap: CommandMap
): Array<string> {
  const result: Array<string> = [];
  Object.keys(commandMap).forEach((command) => {
    if (commandMap[command].handleKeyCommand) {
      result.push(command);
    }
  });
  return result;
}

export function getStateFromTextArea(
  textArea: null | HTMLTextAreaElement
): TextState {
  if (textArea == null) {
    const selection: Selection = {
      start: 0,
      end: 0,
    };
    return {
      selection,
      text: '',
      selectedText: '',
    };
  }
  const selection: Selection = {
    start: textArea?.selectionStart,
    end: textArea?.selectionEnd,
  };
  return {
    selection,
    text: textArea?.value,
    selectedText: textArea?.value.slice(
      textArea?.selectionStart,
      textArea?.selectionEnd
    ),
  };
}
