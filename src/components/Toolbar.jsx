// @flow
import * as React from 'react';
import { L18n } from '..';
import { ToolbarButtonGroup } from './ToolbarButtonGroup';
import { ToolbarButton } from './ToolbarButton';
import { SvgIcon } from '../icons';

export interface ToolbarButtonData {
  commandName: string;
  buttonContent: React.Node;
  buttonProps: any;
  buttonComponentClass: React.ComponentType<> | string;
}

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
    <div className="mde-tabs">
      <button
        type="button"
        className={classNames({ selected: props.tab === 'write' })}
        onClick={() => handleTabChange('write')}
        {...writeButtonProps}>
        {l18n.write}
      </button>
      <button
        type="button"
        className={classNames({ selected: props.tab === 'preview' })}
        onClick={() => handleTabChange('preview')}
        {...previewButtonProps}>
        {l18n.preview}
      </button>
    </div>
  );

  return (
    <div className={classNames('mde-header', classes)}>
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
      <ul className="mde-header-group-right">
        <li className="mde-header-item">
          <button type="button" onClick={() => handleMaximize()}>
            <SvgIcon icon="maximize" />
          </button>
        </li>
      </ul>
    </div>
  );
};
