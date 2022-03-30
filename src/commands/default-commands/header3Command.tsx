
import { setHeader } from './common';

const header3Command: Command = {
  buttonProps: { 'aria-label': 'Add header level 3' },
  execute: ({ initialState, textApi }) => {
    setHeader(initialState, textApi, '### ');
  },
};

export default header3Command;
