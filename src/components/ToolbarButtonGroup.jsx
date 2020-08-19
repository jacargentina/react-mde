// @flow
import * as React from 'react';

export type ToolbarButtonGroupProps = {
  children: React.Node,
  hidden: boolean
};

export const ToolbarButtonGroup = (props: ToolbarButtonGroupProps) => {
  return (
    <ul className={classNames('mde-header-group', { hidden: props.hidden })}>
      {props.children}
    </ul>
  );
};
