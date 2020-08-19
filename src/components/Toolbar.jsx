// @flow
import * as React from 'react';
import { ToolbarButtonGroup } from './ToolbarButtonGroup';
import { ToolbarButton } from './ToolbarButton';
import { SvgIcon } from '../icons';
import { colors, paddings, misc } from './theme';
import css from 'styled-jsx/css';

export type ToolbarButtonData = {
  commandName: string,
  buttonContent: React.Node,
  buttonProps: any,
  buttonComponentClass: any
};

export type ToolbarProps = {
  children: React.Node,
  buttons: ToolbarButtonData[][],
  onCommand: (commandName: string) => void,
  onTabChange: (tab: Tab) => void,
  onMaximize: () => void,
  readOnly: boolean,
  disablePreview: boolean,
  tab: Tab,
  l18n: L18n,
  writeButtonProps: ButtonChildProps,
  previewButtonProps: ButtonChildProps,
  buttonProps: ButtonChildProps
};

export const Toolbar = (props: ToolbarProps) => {
  const {
    children,
    buttons,
    onCommand,
    readOnly,
    disablePreview,
    writeButtonProps,
    previewButtonProps,
    buttonProps,
    l18n,
    onTabChange,
    onMaximize
  } = props;

  const handleTabChange = (tab: Tab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handleMaximize = () => {
    if (onMaximize) {
      onMaximize();
    }
  };

  if ((!buttons || buttons.length === 0) && !children) {
    return null;
  }

  const writePreviewTabs = (
    <div>
      <style jsx>
        {`
          div {
            display: flex;
            flex-direction: row;
          }

          button {
            border-radius: ${misc.borderRadius};
            margin: 6px 3px;
            background-color: transparent;
            border: 1px solid transparent;
            cursor: pointer;
          }

          button:first-child {
            margin-left: 6px;
          }

          button.selected {
            border: 1px solid ${colors.border};
          }
        `}
      </style>
      <button
        type="button"
        className={props.tab === 'write' ? 'selected' : ''}
        onClick={() => handleTabChange('write')}
        {...writeButtonProps}>
        {l18n.write}
      </button>
      <button
        type="button"
        className={props.tab === 'preview' ? 'selected' : ''}
        onClick={() => handleTabChange('preview')}
        {...previewButtonProps}>
        {l18n.preview}
      </button>
    </div>
  );

  return (
    <div>
      <style jsx>
        {`
          div {
            flex-shrink: 0;
            display: flex;
            flex-wrap: wrap;
            align-items: stretch;
            border-bottom: 1px solid ${colors.border};
            border-radius: ${misc.borderRadius} ${misc.borderRadius} 0 0;
            background: ${colors.toolbar};
          }

          ul {
            margin: 0;
            padding: ${paddings.toolbar};
            list-style: none;
            display: flex;
            flex: 1;
            flex-direction: row-reverse;
            flex-wrap: nowrap;
          }
          li {
            display: inline-block;
            position: relative;
            margin: 0 4px;
          }
        `}
      </style>
      {!disablePreview && writePreviewTabs}
      {buttons.map((commandGroup: ToolbarButtonData[], i: number) => (
        <ToolbarButtonGroup key={i} hidden={props.tab === 'preview'}>
          {commandGroup.map((c: ToolbarButtonData, j) => {
            return (
              <ToolbarButton
                key={j}
                name={c.commandName}
                buttonContent={c.buttonContent}
                buttonProps={{ ...(buttonProps || {}), ...c.buttonProps }}
                onClick={() => onCommand(c.commandName)}
                readOnly={readOnly}
                buttonComponentClass={c.buttonComponentClass}
              />
            );
          })}
        </ToolbarButtonGroup>
      ))}
      <ul>
        <ToolbarButton
          name="maximize"
          readOnly={false}
          buttonContent={<SvgIcon icon="maximize" />}
          buttonComponentClass="button"
          onClick={() => handleMaximize()}
        />
      </ul>
    </div>
  );
};
