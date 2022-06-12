import * as React from 'react';
import { ToolbarButton, useReactMde } from '../components';
import { setHeader } from './common';

const Header2Command = () => {
  const { getTextState, textApi, getIcon } = useReactMde();

  return (
    <ToolbarButton
      name="header2"
      aria-label="Add header level 2"
      onClick={() => {
        setHeader(getTextState(), textApi, '## ');
      }}>
      {getIcon('header2')}
    </ToolbarButton>
  );
};

export default Header2Command;
