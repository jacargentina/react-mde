import * as React from 'react';
import { ToolbarButton, useReactMde } from '../components';
import { setHeader } from './common';

const Header6Command = () => {
  const { getTextState, textApi, getIcon } = useReactMde();

  return (
    <ToolbarButton
      name="header6"
      aria-label="Add header level 6"
      onClick={() => {
        setHeader(getTextState(), textApi, '###### ');
      }}>
      {getIcon('header6')}
    </ToolbarButton>
  );
};

export default Header6Command;
