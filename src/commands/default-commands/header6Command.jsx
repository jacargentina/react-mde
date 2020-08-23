// @flow

import { setHeader } from './common';

const header6Command: Command = {
  buttonProps: { 'aria-label': 'Add header level 6' },
  execute: ({ initialState, textApi }) => {
    setHeader(initialState, textApi, '###### ');
  },
};

export default header6Command;
