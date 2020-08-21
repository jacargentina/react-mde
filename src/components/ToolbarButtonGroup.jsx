// @flow
import * as React from 'react';
import { paddings } from './theme';

export type ToolbarButtonGroupProps = {
  children: React.Node,
  hidden: boolean,
};

export const ToolbarButtonGroup = (props: ToolbarButtonGroupProps) => {
  const { hidden, children } = props;
  return (
    <ul>
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
