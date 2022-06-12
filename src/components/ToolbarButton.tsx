import * as React from 'react';

export type ToolbarButtonProps = {
  name: string;
  onClick?: React.MouseEventHandler;
  readOnly?: boolean;
  [name: string]: any;
};

export const ToolbarButton = (props: ToolbarButtonProps) => {
  const { name, onClick, readOnly, children, ...rest } = props;

  const finalButtonProps = {
    className: 'toolbarButton',
    tabIndex: -1,
    'data-name': name,
    ...rest,
  };

  return (
    <li
      style={{
        display: 'inline-block',
        position: 'relative',
        margin: '0 4px',
      }}>
      {React.createElement(
        'button',
        {
          ...finalButtonProps,
          ...{
            onClick,
            disabled: readOnly,
            type: 'button',
          },
        },
        children
      )}
    </li>
  );
};
