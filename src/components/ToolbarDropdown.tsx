import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { ToolbarButton } from './ToolbarButton';
import { ButtonChildProps, ToolbarRenderGroup } from '~';
import './ToolbarDropdown.css';

export type ToolbarDropdownProps = {
  dropdownContent: React.ReactNode;
  dropdownProps?: ButtonChildProps;
  commands: ToolbarRenderGroup;
  onCommand: (commandName: string) => void;
  readOnly: boolean;
};

export const ToolbarDropdown = (props: ToolbarDropdownProps) => {
  const { readOnly, onCommand, dropdownContent, dropdownProps, commands } =
    props;
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
      />
    );
  });

  const dropdownItems = open ? (
    <ul className="react-mde-toolbar-dropdown-items" ref={dropdown}>
      {items}
    </ul>
  ) : null;

  const finalButtonProps = {
    tabIndex: -1,
    ...(dropdownProps || {}),
  };

  return (
    <li className="react-mde-toolbar-dropdown">
      <button
        className="toolbarButton"
        type="button"
        {...finalButtonProps}
        ref={dropdownOpener}
        onClick={handleClick}
        disabled={readOnly}
      >
        {dropdownContent}
      </button>
      {dropdownItems}
    </li>
  );
};
