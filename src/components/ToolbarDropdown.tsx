import * as React from 'react';
import { useState, useEffect, useRef } from 'react';

export type ToolbarDropdownProps = {
  dropdownContent: React.ReactNode;
  readOnly: boolean;
  children: any;
};

export const ToolbarDropdown = (props: ToolbarDropdownProps) => {
  const { readOnly, dropdownContent, children } = props;
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

  // TODO
  const handleOnClickCommand = (commandName: string) => {
    //onCommand(commandName);
    closeDropdown();
  };

  const handleClick = () => {
    if (!open) {
      openDropdown();
    } else {
      closeDropdown();
    }
  };

  const dropdownItems = open ? (
    <ul className="react-mde-toolbar-dropdown-items" ref={dropdown}>
      {children}
    </ul>
  ) : null;

  return (
    <li className="react-mde-toolbar-dropdown">
      <button
        className="toolbarButton"
        type="button"
        tabIndex={-1}
        ref={dropdownOpener}
        onClick={handleClick}
        disabled={readOnly}>
        {dropdownContent}
      </button>
      {dropdownItems}
    </li>
  );
};
