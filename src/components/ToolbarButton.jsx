// @flow
import * as React from 'react';
import css from 'styled-jsx/css';
import { colors } from './theme';

export type ToolbarButtonProps = {
  name: string,
  buttonComponentClass?: any,
  buttonProps?: any,
  buttonContent: React.Node,
  onClick: ?(evt: Event) => mixed,
  readOnly: boolean,
};

const { className, styles } = css.resolve`
  text-align: left;
  cursor: pointer;
  height: 22px;
  padding: 4px;
  margin: 0;
  border: none;
  background: none;
  color: ${colors.button};

  .tooltipped:hover::before {
    opacity: 0;
    position: absolute;
    z-index: 1000001;
    width: 0;
    height: 0;
    color: rgba(0, 0, 0, 0.8);
    pointer-events: none;
    content: '';
    border: 5px solid transparent;
    top: -5px;
    right: 50%;
    bottom: auto;
    margin-right: -5px;
    border-top-color: rgba(0, 0, 0, 0.8);
  }

  .tooltipped:hover::after {
    font-size: 11px;
    opacity: 0;
    position: absolute;
    z-index: 1000000;
    padding: 5px 8px;
    color: #fff;
    pointer-events: none;
    content: attr(aria-label);
    background: rgba(0, 0, 0, 0.8);
    border-radius: 3px;
    right: 50%;
    bottom: 100%;
    transform: translateX(50%);
    margin-bottom: 5px;
    white-space: nowrap;
  }
`;

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
    className,
    tabIndex: -1,
    'data-name': name,
    ...(buttonProps || {}),
  };

  const finalButtonComponent = buttonComponentClass || 'button';

  return (
    <li>
      <style jsx>
        {`
          li {
            display: inline-block;
            position: relative;
            margin: 0 4px;
          }
        `}
      </style>
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
      {styles}
    </li>
  );
};
