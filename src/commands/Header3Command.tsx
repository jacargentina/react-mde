import * as React from 'react';
import { ToolbarButton, useReactMde } from '../components/index.js';
import { setHeader } from './common.js';

const Header3Command = () => {
  const { getTextState, textApi, getIcon } = useReactMde();

  return (
    <ToolbarButton
      name="header3"
      aria-label="Add header level 3"
      onClick={() => {
        setHeader(getTextState(), textApi, '### ');
      }}>
      {getIcon('header3')}
    </ToolbarButton>
  );
};

export default Header3Command;
