// @flow
import * as React from 'react';

export type ToolbarButtonProps = {
  name: string,
  buttonComponentClass?: React.ComponentType<any> | string,
  buttonProps: any,
  buttonContent: React.Node,
  onClick: ?(evt: Event) => mixed,
  readOnly: boolean
};

const defaultButtonProps = {
  tabIndex: -1
};

export const ToolbarButton = (props: ToolbarButtonProps) => {
  const {
    buttonComponentClass,
    buttonContent,
    buttonProps,
    onClick,
    readOnly,
    name
  } = props;
  const finalButtonProps = { ...defaultButtonProps, ...(buttonProps || {}) };
  const finalButtonComponent = buttonComponentClass || 'button';
  return (
    <li className="mde-header-item">
      {React.createElement(
        finalButtonComponent,
        {
          'data-name': name,
          ...finalButtonProps,
          ...{
            onClick,
            disabled: readOnly,
            type: 'button'
          }
        },
        buttonContent
      )}
    </li>
  );
};
