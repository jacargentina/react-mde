// @flow
import * as React from 'react';
import { ToolbarButtonGroup } from './ToolbarButtonGroup';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarDropdown } from './ToolbarDropdown';
import SvgIcon from './SvgIcon';
import { colors, paddings, misc } from './theme';

export type ToolbarProps = {
  buttons: ToolbarRenderGroups,
  onCommand: (commandName: string) => void,
  onTabChange: (tab: Tab) => void,
  onMaximize: () => void,
  readOnly: boolean,
  disablePreview: boolean,
  disableMaximize: boolean,
  tab: Tab,
  l18n: L18n,
  writeButtonProps?: ButtonChildProps,
  previewButtonProps?: ButtonChildProps,
  buttonProps?: ButtonChildProps,
};

export const Toolbar = (props: ToolbarProps) => {
  const {
    buttons,
    tab,
    onCommand,
    readOnly,
    disablePreview = false,
    disableMaximize = false,
    writeButtonProps = {},
    previewButtonProps = {},
    buttonProps,
    l18n,
    onTabChange,
    onMaximize,
  } = props;

  const handleTabChange = (tabName: Tab) => {
    if (onTabChange) {
      onTabChange(tabName);
    }
  };

  const handleMaximize = () => {
    if (onMaximize) {
      onMaximize();
    }
  };

  if (!buttons || buttons.length === 0) {
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
        className={tab === 'write' ? 'selected' : ''}
        onClick={() => handleTabChange('write')}
        {...writeButtonProps}>
        {l18n.write}
      </button>
      <button
        type="button"
        className={tab === 'preview' ? 'selected' : ''}
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

          ul.maximizeRight {
            margin: 0;
            padding: ${paddings.toolbar};
            list-style: none;
            display: flex;
            flex: 1;
            flex-direction: row-reverse;
            flex-wrap: nowrap;
          }
        `}
      </style>
      {!disablePreview && writePreviewTabs}
      {buttons.map((group: ToolbarRenderGroup) => (
        <ToolbarButtonGroup
          key={group.name}
          hidden={props.tab === 'preview'}
          className={group.dropdownContent ? 'dropdown' : ''}>
          {group.dropdownContent ? (
            <ToolbarDropdown
              dropdownContent={group.dropdownContent}
              dropdownProps={group.dropdownProps}
              commands={group}
              onCommand={onCommand}
              readOnly={readOnly}
            />
          ) : (
            group.items.map((c) => {
              return (
                <ToolbarButton
                  key={c.commandName}
                  name={c.commandName}
                  buttonContent={c.buttonContent}
                  buttonProps={{ ...(buttonProps || {}), ...c.buttonProps }}
                  onClick={() => onCommand(c.commandName)}
                  readOnly={readOnly}
                  buttonComponentClass={c.buttonComponentClass}
                />
              );
            })
          )}
        </ToolbarButtonGroup>
      ))}
      {!disableMaximize && (
        <ul className="maximizeRight">
          <ToolbarButton
            name="maximize"
            readOnly={false}
            buttonContent={<SvgIcon icon="maximize" />}
            buttonComponentClass="button"
            onClick={() => handleMaximize()}
          />
        </ul>
      )}
    </div>
  );
};
