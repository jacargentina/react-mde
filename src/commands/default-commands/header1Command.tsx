import { setHeader } from './common';

const header1Command: Command = {
  buttonProps: { 'aria-label': 'Add header level 1' },
  execute: ({ initialState, textApi }) => {
    setHeader(initialState, textApi, '# ');
  },
};

export default header1Command;
