import * as React from 'react';

export type ToolbarButtonProps = {
  name: string;
  buttonComponentClass?: any;
  buttonProps?: any;
  buttonContent: React.ReactNode;
  onClick?: React.MouseEventHandler;
  readOnly: boolean;
};

export const ToolbarButton = (props: ToolbarButtonProps) => {
  const {
    buttonComponentClass,
    buttonContent,
    buttonProps,
    onClick,
    readOnly,
    name,
  } = props;

  const finalButtonProps = {
    className: 'toolbarButton',
    tabIndex: -1,
    'data-name': name,
    ...(buttonProps || {}),
  };

  const finalButtonComponent = buttonComponentClass || 'button';

  return (
    <li
      style={{
        display: 'inline-block',
        position: 'relative',
        margin: '0 4px',
      }}
    >
      {React.createElement(
        finalButtonComponent,
        {
          ...finalButtonProps,
          ...{
            onClick,
            disabled: readOnly,
            type: 'button',
          },
        },
        buttonContent
      )}
    </li>
  );
};
