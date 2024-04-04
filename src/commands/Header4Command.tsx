import * as React from 'react';
import { ToolbarButton, useReactMde } from '../components/index.js';
import { setHeader } from './common.js';

const Header4Command = () => {
  const { getTextState, textApi, getIcon } = useReactMde();

  return (
    <ToolbarButton
      name="header4"
      aria-label="Add header level 4"
      onClick={() => {
        setHeader(getTextState(), textApi, '#### ');
      }}>
      {getIcon('header4')}
    </ToolbarButton>
  );
};

export default Header4Command;
