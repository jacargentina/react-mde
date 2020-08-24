// @flow
import * as React from 'react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Preview } from './Preview';
import { Toolbar } from './Toolbar';
import { TextArea } from './TextArea';
import {
  getDefaultCommandMap,
  getDefaultToolbarCommands,
  getDefaultSaveImageCommandName,
} from '../commands/default-commands/defaults';
import enL18n from '../l18n/react-mde.en';
import SvgIcon from './SvgIcon';
import { colors, misc } from './theme';
import {
  extractKeyActivatedCommands,
  getStateFromTextArea,
} from '../commands/command-utils';
import TextAreaTextApi from '../commands/TextAreaTextApi';

export type ReactMdeProps = {
  value: string,
  onChange: (value: string) => void,
  selectedTab: Tab,
  isMaximized?: boolean,
  onTabChange: (tab: Tab) => void,
  onMaximizedChange?: (isMaximized: boolean) => void,
  generateMarkdownPreview: GenerateMarkdownPreview,
  toolbarCommands: ToolbarGroups,
  commands: CommandMap,
  getIcon?: GetIcon,
  loadingPreview?: React.Node,
  readOnly?: boolean,
  disablePreview?: boolean,
  disableMaximize?: boolean,
  suggestionTriggerCharacters?: string[],
  loadSuggestions?: (text: string) => Promise<Suggestion[]>,
  childProps?: ChildProps,
  paste?: PasteOptions,
  l18n?: L18n,
  textAreaComponent?: any,
  minHeight?: number,
};

export const ReactMde = (props: ReactMdeProps) => {
  const {
    getIcon = (name) => <SvgIcon icon={name} />,
    commands = getDefaultCommandMap(),
    toolbarCommands = getDefaultToolbarCommands(),
    loadingPreview,
    readOnly = false,
    disablePreview = false,
    disableMaximize = false,
    isMaximized = false,
    value,
    l18n = enL18n,
    childProps = {},
    selectedTab = 'write',
    generateMarkdownPreview,
    loadSuggestions,
    suggestionTriggerCharacters = ['@'],
    textAreaComponent,
    paste,
    onChange,
    onMaximizedChange,
    onTabChange,
    minHeight,
  } = props;
  const textarea = useRef<null | HTMLTextAreaElement>(null);
  const preview = useRef<null | HTMLDivElement>(null);
  const [maximized, setMaximized] = useState(isMaximized);
  const isExecuting = useRef(false);

  const textApi = useRef(new TextAreaTextApi(textarea));
  const keyActivatedCommands = useMemo(() => {
    return extractKeyActivatedCommands(commands);
  }, [commands]);

  const adjustTextareaHeight = () => {
    if (textarea.current && maximized) {
      textarea.current.style.height = 'auto';
    }
  };

  const getCommand = (name: string): Command => {
    const command = commands[name];
    if (!command) {
      throw new Error(`Cannot execute command. Command not found: ${name}`);
    }
    return command;
  };

  const executeCommand = async (
    commandName: string,
    context: CommandContext
  ): Promise<void> => {
    if (isExecuting.current) {
      // The simplest thing to do is to ignore commands while
      // there is already a command executing. The alternative would be to queue commands
      // but there is no guarantee that the state after one command executes will still be compatible
      // with the next one. In fact, it is likely not to be.
      return;
    }

    isExecuting.current = true;
    const command = commands[commandName];
    const result = command.execute({
      initialState: getStateFromTextArea(textarea.current),
      textApi: textApi.current,
      l18n,
      context,
    });
    await result;
    isExecuting.current = false;
  };

  /**
   * Tries to find a command the wants to handle the keyboard event.
   * If a command is found, it is executed and the function returns
   */
  const handlePossibleKeyCommand = (
    e: SyntheticKeyboardEvent<HTMLTextAreaElement>
  ): boolean => {
    for (let i = 0; i < keyActivatedCommands.length; i += 1) {
      const commandName = keyActivatedCommands[i];
      const handler = getCommand(commandName).handleKeyCommand;
      if (handler && handler(e)) {
        executeCommand(commandName, {});
        return true;
      }
    }
    return false;
  };

  /**
   * Executes the paste command
   */
  const executePasteCommand = async (
    event: SyntheticClipboardEvent<HTMLTextAreaElement>
  ): Promise<void> => {
    if (paste) {
      return executeCommand(paste.command || getDefaultSaveImageCommandName(), {
        saveImage: paste.saveImage,
        event,
      });
    }
    return undefined;
  };

  /**
   * Executes the drop command
   */
  const executeDropCommand = async (
    event: SyntheticDragEvent<HTMLTextAreaElement>
  ): Promise<void> => {
    if (paste) {
      return executeCommand(paste.command || getDefaultSaveImageCommandName(), {
        saveImage: paste.saveImage,
        event,
      });
    }
    return undefined;
  };

  /**
   * Executes the "select image" command
   */
  const executeSelectImageCommand = async (
    event: SyntheticInputEvent<HTMLTextAreaElement>
  ): Promise<void> => {
    if (paste) {
      return executeCommand(paste.command || getDefaultSaveImageCommandName(), {
        saveImage: paste.saveImage,
        event,
      });
    }
    return undefined;
  };

  useEffect(() => {
    if (onMaximizedChange) {
      onMaximizedChange(maximized);
    }
    adjustTextareaHeight();
  }, [maximized, textarea]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [textarea]);

  const toolbarButtons: ToolbarRenderGroups = toolbarCommands.map((group) => {
    const { name, dropdownContent, items } = group;
    return {
      name,
      dropdownContent,
      items: items.map((commandName) => {
        const command = getCommand(commandName);
        const cmdIcon = command.icon
          ? command.icon(getIcon)
          : getIcon(commandName);
        return {
          commandName,
          buttonContent: (
            <span>
              {cmdIcon}
              {command.title}
            </span>
          ),
          buttonProps: command.buttonProps,
          buttonComponentClass: command.buttonComponentClass,
        };
      }),
    };
  });

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
          executeCommand(commandName, {});
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
        disableMaximize={disableMaximize}
        l18n={l18n}
        buttonProps={childProps.commandButtons}
        writeButtonProps={childProps.writeButton}
        previewButtonProps={childProps.previewButton}
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
            executePasteCommand(event);
          }}
          onDrop={(event: SyntheticDragEvent<HTMLTextAreaElement>) => {
            if (!paste || !paste.saveImage) {
              return;
            }
            executeDropCommand(event);
          }}
          readOnly={readOnly}
          maximized={maximized}
          textAreaComponent={textAreaComponent}
          textAreaProps={childProps.textArea}
          value={value}
          suggestionTriggerCharacters={suggestionTriggerCharacters}
          loadSuggestions={loadSuggestions}
          onPossibleKeyCommand={(e) => {
            return handlePossibleKeyCommand(e);
          }}
          minHeight={minHeight}
        />
        {paste && (
          // eslint-disable-next-line
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
                executeSelectImageCommand(event);
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
          generateMarkdownPreview={generateMarkdownPreview}
          markdown={value}
        />
      )}
    </div>
  );
};
