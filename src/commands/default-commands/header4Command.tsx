import { Command } from '../..';
import { setHeader } from './common';

const header4Command: Command = {
  buttonProps: { 'aria-label': 'Add header level 4' },
  execute: ({ initialState, textApi }) => {
    setHeader(initialState, textApi, '#### ');
  },
};

export default header4Command;
