import { Command } from '~';
import { setHeader } from './common';

const header2Command: Command = {
  buttonProps: { 'aria-label': 'Add header level 2' },
  execute: ({ initialState, textApi }) => {
    setHeader(initialState, textApi, '## ');
  },
};

export default header2Command;
