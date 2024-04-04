import * as React from 'react';
import { useReactMde } from './ReactMdeContext.js';

export type ToolbarButtonGroupProps = {
  className?: string;
  children: React.ReactNode;
};

export const ToolbarButtonGroup = (props: ToolbarButtonGroupProps) => {
  const { children, className = '' } = props;
  const reactMde = useReactMde();
  return (
    <ul
      className={`react-mde-toolbar-button-group ${className}`}
      style={{
        visibility: reactMde.selectedTab == 'preview' ? 'hidden' : 'visible',
      }}>
      {children}
    </ul>
  );
};
