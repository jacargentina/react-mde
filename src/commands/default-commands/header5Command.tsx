import { Command } from '../..';
import { setHeader } from './common';

const header5Command: Command = {
  buttonProps: { 'aria-label': 'Add header level 5' },
  execute: ({ initialState, textApi }) => {
    setHeader(initialState, textApi, '##### ');
  },
};

export default header5Command;
