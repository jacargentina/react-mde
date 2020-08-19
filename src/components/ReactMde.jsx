// @flow
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Preview, Toolbar, TextArea, ToolbarButtonData } from '.';
import {
  getDefaultCommandMap,
  getDefaultToolbarCommands
} from '../commands/default-commands/defaults';
import { L18n } from '..';
import { enL18n } from '../l18n/react-mde.en';
import { SvgIcon } from '../icons';
import { CommandOrchestrator } from '../commands/command-orchestrator';

export type ReactMdeProps = {
  value: string,
  onChange: (value: string) => void,
  selectedTab: Tab,
  onTabChange: (tab: Tab) => void,
  onMaximizedChange: (isMaximized: boolean) => void,
  generateMarkdownPreview: GenerateMarkdownPreview,
  minPreviewHeight: number,
  toolbarCommands: ToolbarCommands,
  commands: CommandMap,
  getIcon: GetIcon,
  loadingPreview?: React.Node,
  readOnly?: boolean,
  disablePreview?: boolean,
  suggestionTriggerCharacters?: string[],
  loadSuggestions?: (text: string) => Promise<Suggestion[]>,
  childProps?: ChildProps,
  paste?: PasteOptions,
  l18n: L18n,
  textAreaComponent?: any,
  toolbarButtonComponent?: any
};

export const ReactMde = (props: ReactMdeProps) => {
  const {
    getIcon,
    toolbarCommands,
    loadingPreview,
    readOnly,
    disablePreview,
    value,
    l18n,
    minPreviewHeight,
    childProps,
    selectedTab,
    generateMarkdownPreview,
    loadSuggestions,
    suggestionTriggerCharacters,
    textAreaComponent,
    paste,
    onChange,
    onMaximizedChange,
    onTabChange
  } = props;
  const textarea = useRef<null | HTMLTextAreaElement>(null);
  const preview = useRef<null | HTMLDivElement>(null);
  const commandOrchestrator = useRef(
    new CommandOrchestrator(
      props.commands,
      textarea.current,
      props.l18n,
      props.paste
    )
  );
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    if (onMaximizedChange) {
      onMaximizedChange(maximized);
    }
  }, [maximized]);

  const finalChildProps = childProps || {};

  const toolbarButtons = toolbarCommands.map(group => {
    return group.map(commandName => {
      const command = commandOrchestrator.current.getCommand(commandName);
      return {
        commandName: commandName,
        buttonContent: command.icon
          ? command.icon(getIcon)
          : getIcon(commandName),
        buttonProps: command.buttonProps,
        buttonComponentClass: command.buttonComponentClass
      };
    });
  });

  return (
    <div
      className={classNames(
        'react-mde',
        'react-mde-tabbed-layout',
        { 'react-mde-maximized': maximized },
        classes?.reactMde
      )}>
      <Toolbar
        classes={classes?.toolbar}
        buttons={toolbarButtons}
        onCommand={async (commandName: string) => {
          await commandOrchestrator.current.executeCommand(commandName, {});
        }}
        onTabChange={(newTab: Tab) => {
          if (onTabChange) {
            onTabChange(newTab);
          }
        }}
        onMaximize={() => setMaximized(current => !current)}
        tab={selectedTab}
        readOnly={readOnly}
        disablePreview={disablePreview}
        l18n={l18n}
        buttonProps={finalChildProps.commandButtons}
        writeButtonProps={finalChildProps.writeButton}
        previewButtonProps={finalChildProps.previewButton}
      />
      <div
        className={classNames('mde-editor', {
          invisible: selectedTab !== 'write'
        })}>
        <TextArea
          classes={classes?.textArea}
          suggestionsDropdownClasses={classes?.suggestionsDropdown}
          refObject={textarea}
          onChange={(value: string) => {
            if (onChange) {
              onChange(value);
            }
          }}
          onPaste={async (
            event: SyntheticClipboardEvent<HTMLTextAreaElement>
          ) => {
            if (!paste || !paste.saveImage) {
              return;
            }
            await commandOrchestrator.current.executePasteCommand(event);
          }}
          onDrop={async (event: SyntheticDragEvent<HTMLTextAreaElement>) => {
            if (!paste || !paste.saveImage) {
              return;
            }
            await commandOrchestrator.current.executeDropCommand(event);
          }}
          readOnly={readOnly}
          textAreaComponent={textAreaComponent}
          textAreaProps={childProps && childProps.textArea}
          value={value}
          suggestionTriggerCharacters={suggestionTriggerCharacters}
          loadSuggestions={loadSuggestions}
          onPossibleKeyCommand={
            commandOrchestrator.current.handlePossibleKeyCommand
          }
        />
        {paste && (
          <label className={classNames('image-tip')}>
            <input
              className={classNames('image-input')}
              type="file"
              accept="image/*"
              multiple
              onChange={async (
                event: SyntheticInputEvent<HTMLTextAreaElement>
              ) => {
                if (!paste || !paste.saveImage) {
                  return;
                }
                await commandOrchestrator.current.executeSelectImageCommand(
                  event
                );
              }}
            />
            <span>{l18n.pasteDropSelect}</span>
          </label>
        )}
      </div>
      {selectedTab !== 'write' && (
        <Preview
          classes={classes?.preview}
          refObject={preview}
          loadingPreview={loadingPreview}
          minHeight={minPreviewHeight}
          generateMarkdownPreview={generateMarkdownPreview}
          markdown={value}
        />
      )}
    </div>
  );
};

ReactMde.defaultProps = {
  commands: getDefaultCommandMap(),
  toolbarCommands: getDefaultToolbarCommands(),
  getIcon: name => <SvgIcon icon={name} />,
  readOnly: false,
  l18n: enL18n,
  selectedTab: 'write',
  disablePreview: false,
  suggestionTriggerCharacters: ['@']
};
