import * as React from 'react';
import './ToolbarButtonGroup.css';

export type ToolbarButtonGroupProps = {
  className: string;
  children: React.ReactNode;
  hidden: boolean;
};

export const ToolbarButtonGroup = (props: ToolbarButtonGroupProps) => {
  const { hidden, children, className = '' } = props;
  return (
    <ul
      className={`react-mde-toolbar-button-group ${className}`}
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
    >
      {children}
    </ul>
  );
};
