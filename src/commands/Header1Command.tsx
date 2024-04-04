import * as React from 'react';
import { ToolbarButton, useReactMde } from '../components/index.js';
import { setHeader } from './common.js';

const Header1Command = () => {
  const { getTextState, textApi, getIcon } = useReactMde();

  return (
    <ToolbarButton
      name="header1"
      aria-label="Add header level 1"
      onClick={() => {
        setHeader(getTextState(), textApi, '# ');
      }}>
      {getIcon('header1')}
    </ToolbarButton>
  );
};

export default Header1Command;
