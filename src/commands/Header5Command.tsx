import * as React from 'react';
import { ToolbarButton, useReactMde } from '../components';
import { setHeader } from './common';

const Header5Command = () => {
  const { getTextState, textApi, getIcon } = useReactMde();

  return (
    <ToolbarButton
      name="header5"
      aria-label="Add header level 5"
      onClick={() => {
        setHeader(getTextState(), textApi, '##### ');
      }}>
      {getIcon('header5')}
    </ToolbarButton>
  );
};

export default Header5Command;
