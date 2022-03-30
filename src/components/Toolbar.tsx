import * as React from 'react';
import { ToolbarButtonGroup } from './ToolbarButtonGroup';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarDropdown } from './ToolbarDropdown';
import SvgIcon from './SvgIcon';
import {
  ButtonChildProps,
  L18n,
  Tab,
  ToolbarRenderGroup,
  ToolbarRenderGroups,
} from '..';

export type ToolbarProps = {
  buttons: ToolbarRenderGroups;
  onCommand: (commandName: string) => void;
  onTabChange: (tab: Tab) => void;
  onMaximize: () => void;
  readOnly: boolean;
  disablePreview: boolean;
  disableMaximize: boolean;
  tab: Tab;
  l18n: L18n;
  writeButtonProps?: ButtonChildProps;
  previewButtonProps?: ButtonChildProps;
  buttonProps?: ButtonChildProps;
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
    <div className="react-mde-toolbar-buttons">
      <button
        type="button"
        className={tab === 'write' ? 'selected' : ''}
        onClick={() => handleTabChange('write')}
        {...writeButtonProps}
      >
        {l18n.write}
      </button>
      <button
        type="button"
        className={tab === 'preview' ? 'selected' : ''}
        onClick={() => handleTabChange('preview')}
        {...previewButtonProps}
      >
        {l18n.preview}
      </button>
    </div>
  );

  return (
    <div className="react-mde-toolbar">
      {!disablePreview && writePreviewTabs}
      {buttons.map((group: ToolbarRenderGroup) => (
        <ToolbarButtonGroup
          key={group.name}
          hidden={props.tab === 'preview'}
          className={group.dropdownContent ? 'dropdown' : ''}
        >
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
