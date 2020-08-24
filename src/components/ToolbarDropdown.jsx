// @flow
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { ToolbarButton } from './ToolbarButton';
import { colors } from './theme';

declare var document: any;

export type ToolbarDropdownProps = {
  dropdownContent: React.Node,
  dropdownProps?: ButtonChildProps,
  commands: ToolbarRenderGroup,
  onCommand: (commandName: string) => void,
  readOnly: boolean,
};

export const ToolbarDropdown = (props: ToolbarDropdownProps) => {
  const {
    readOnly,
    onCommand,
    dropdownContent,
    dropdownProps,
    commands,
  } = props;
  const dropdown = useRef<any>();
  const dropdownOpener = useRef<any>();
  const [open, setOpen] = useState(false);

  const openDropdown = () => {
    setOpen(true);
  };

  const closeDropdown = () => {
    setOpen(false);
  };

  const clickedOutside = (e: Event) => {
    const { target } = e;
    return (
      dropdown.current &&
      dropdownOpener.current &&
      !dropdown.current.contains(target) &&
      !dropdownOpener.current.contains(target)
    );
  };

  const handleGlobalClick = (e: Event) => {
    if (clickedOutside(e)) {
      closeDropdown();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleGlobalClick, false);
    return () => {
      document.removeEventListener('click', handleGlobalClick, false);
    };
  }, []);

  const handleOnClickCommand = (commandName: string) => {
    onCommand(commandName);
    closeDropdown();
  };

  const handleClick = () => {
    if (!open) {
      openDropdown();
    } else {
      closeDropdown();
    }
  };

  const items = commands.items.map((c) => {
    return (
      <ToolbarButton
        key={c.commandName}
        name={c.commandName}
        buttonContent={c.buttonContent}
        buttonProps={c.buttonProps}
        onClick={() => handleOnClickCommand(c.commandName)}
        readOnly={readOnly}
        buttonComponentClass={c.buttonComponentClass}
        display='block'
      />
    );
  });

  const dropdownItems = open ? (
    <ul ref={dropdown}>
      <style jsx>
        {`
          ul {
            position: absolute;
            left: 0;
            top: 30px;
            background-color: white;
            border: 1px solid ${colors.border};
            padding: 5px;
            z-index: 2;
            transform: translateX(-9px);
          }

          ul::before {
            position: absolute;
            content: '';
            width: 0;
            height: 0;
            border: 8px solid transparent;
            border-bottom-color: rgba(0, 0, 0, 0.15);
            top: -16px;
            left: 3px;
            transform: translateX(50%);
          }

          ul::after {
            position: absolute;
            content: '';
            width: 0;
            height: 0;
            border: 7px solid transparent;
            border-bottom-color: white;
            top: -14px;
            left: 5px;
            transform: translateX(50%);
          }
        `}
      </style>
      {items}
    </ul>
  ) : null;

  const finalButtonProps = {
    tabIndex: -1,
    ...(dropdownProps || {}),
  };

  return (
    <li>
      <style jsx>
        {`
          button {
            text-align: left;
            cursor: pointer;
            height: 22px;
            padding: 4px;
            margin: 0;
            border: none;
            background: none;
            color: ${colors.button};
          }
          li {
            display: inline-block;
            position: relative;
            margin: 0 4px;
          }
        `}
      </style>
      <button
        type="button"
        {...finalButtonProps}
        ref={dropdownOpener}
        onClick={handleClick}
        disabled={readOnly}>
        {dropdownContent}
      </button>
      {dropdownItems}
    </li>
  );
};
