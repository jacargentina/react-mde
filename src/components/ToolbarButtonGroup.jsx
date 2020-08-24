// @flow
import * as React from 'react';
import { paddings } from './theme';

export type ToolbarButtonGroupProps = {
  className: string,
  children: React.Node,
  hidden: boolean,
};

export const ToolbarButtonGroup = (props: ToolbarButtonGroupProps) => {
  const { hidden, children, className } = props;
  return (
    <ul className={className}>
      <style jsx>
        {`
          ul {
            margin: 0;
            padding: ${paddings.toolbar};
            list-style: none;
            display: flex;
            flex-wrap: nowrap;
            visibility: ${hidden ? 'hidden' : 'auto'};
          }
        `}
      </style>
      {children}
    </ul>
  );
};
