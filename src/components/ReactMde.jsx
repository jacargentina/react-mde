// @flow
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Preview } from './Preview';
import { Toolbar } from './Toolbar';
import { TextArea } from './TextArea';
import {
  getDefaultCommandMap,
  getDefaultToolbarCommands,
} from '../commands/default-commands/defaults';
import enL18n from '../l18n/react-mde.en';
import { SvgIcon } from './SvgIcon';
import CommandOrchestrator from '../commands/command-orchestrator';
import { colors, misc } from './theme';

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
};

export const ReactMde = (props: ReactMdeProps) => {
  const {
    getIcon,
    commands,
    toolbarCommands,
    loadingPreview,
    readOnly = false,
    disablePreview = false,
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
    onTabChange,
  } = props;
  const textarea = useRef<null | HTMLTextAreaElement>(null);
  const preview = useRef<null | HTMLDivElement>(null);
  const commandOrchestrator = useRef(null);
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    if (onMaximizedChange) {
      onMaximizedChange(maximized);
      if (textarea.current && maximized) {
        textarea.current.style.height = 'auto';
      }
    }
  }, [maximized, textarea]);

  const getCommandOrch = () => {
    if (!commandOrchestrator.current) {
      commandOrchestrator.current = new CommandOrchestrator(
        commands,
        textarea,
        l18n,
        paste
      );
    }
    return commandOrchestrator.current;
  };

  const toolbarButtons = toolbarCommands.map((group) => {
    return group.map((commandName) => {
      const command = getCommandOrch().getCommand(commandName);
      return {
        commandName,
        buttonContent: command.icon
          ? command.icon(getIcon)
          : getIcon(commandName),
        buttonProps: command.buttonProps,
        buttonComponentClass: command.buttonComponentClass,
      };
    });
  });

  const finalChildProps = childProps || {};

  return (
    <div className={maximized ? 'maximized' : ''}>
      <style jsx>
        {`
          div {
            border: 1px solid ${colors.border};
            border-radius: ${misc.borderRadius};
          }

          * {
            box-sizing: border-box;
          }

          .maximized {
            display: flex;
            flex-direction: column;
            flex: 1;
          }

          .mde-editor {
            display: flex;
            flex-direction: column;
            flex: 1;
            display: ${selectedTab !== 'write' ? 'none' : 'auto'};
          }

          .image-tip {
            user-select: none;
            display: flex !important;
            padding: 7px 10px;
            margin: 0;
            font-size: 13px;
            line-height: 16px;
            color: gray;
            background-color: ${colors.toolbar};
            border-top: 1px solid ${colors.border};
            position: relative;
          }

          .image-input {
            min-height: 0;
            opacity: 0.01;
            width: 100% !important;
            position: absolute;
            top: 0;
            left: 0;
            padding: 5px;
            cursor: pointer;
          }
        `}
      </style>
      <Toolbar
        buttons={toolbarButtons}
        onCommand={(commandName: string) => {
          getCommandOrch().executeCommand(commandName, {});
        }}
        onTabChange={(newTab: Tab) => {
          if (onTabChange) {
            onTabChange(newTab);
          }
        }}
        onMaximize={() => setMaximized((current) => !current)}
        tab={selectedTab}
        readOnly={readOnly}
        disablePreview={disablePreview}
        l18n={l18n}
        buttonProps={finalChildProps.commandButtons}
        writeButtonProps={finalChildProps.writeButton}
        previewButtonProps={finalChildProps.previewButton}
      />
      <div className="mde-editor">
        <TextArea
          refObject={textarea}
          onChange={(newValue: string) => {
            if (onChange) {
              onChange(newValue);
            }
          }}
          onPaste={(event: SyntheticClipboardEvent<HTMLTextAreaElement>) => {
            if (!paste || !paste.saveImage) {
              return;
            }
            getCommandOrch().executePasteCommand(event);
          }}
          onDrop={(event: SyntheticDragEvent<HTMLTextAreaElement>) => {
            if (!paste || !paste.saveImage) {
              return;
            }
            getCommandOrch().executeDropCommand(event);
          }}
          readOnly={readOnly}
          maximized={maximized}
          textAreaComponent={textAreaComponent}
          textAreaProps={childProps && childProps.textArea}
          value={value}
          suggestionTriggerCharacters={suggestionTriggerCharacters}
          loadSuggestions={loadSuggestions}
          onPossibleKeyCommand={(e) => {
            getCommandOrch().handlePossibleKeyCommand(e);
          }}
        />
        {paste && (
          <label className="image-tip">
            <input
              className="image-input"
              type="file"
              accept="image/*"
              multiple
              onChange={async (
                event: SyntheticInputEvent<HTMLTextAreaElement>
              ) => {
                if (!paste || !paste.saveImage) {
                  return;
                }
                getCommandOrch().executeSelectImageCommand(event);
              }}
            />
            <span>{l18n.pasteDropSelect}</span>
          </label>
        )}
      </div>
      {selectedTab !== 'write' && (
        <Preview
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
  getIcon: (name) => <SvgIcon icon={name} />,
  readOnly: false,
  l18n: enL18n,
  selectedTab: 'write',
  disablePreview: false,
  suggestionTriggerCharacters: ['@'],
};
