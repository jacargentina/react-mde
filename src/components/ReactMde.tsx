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
import {
  extractKeyActivatedCommands,
  getStateFromTextArea,
} from '../commands/command-utils';
import TextAreaTextApi from '../commands/TextAreaTextApi';
import {
  CommandMap,
  Suggestion,
  ChildProps,
  PasteOptions,
  GenerateMarkdownPreview,
  GetIcon,
  ToolbarGroups,
  L18n,
  Tab,
  Command,
  CommandContext,
  ToolbarRenderGroups,
} from '~';

export type ReactMdeProps = {
  value: string;
  onChange: (value: string) => void;
  selectedTab: Tab;
  isMaximized?: boolean;
  onTabChange: (tab: Tab) => void;
  onMaximizedChange?: (isMaximized: boolean) => void;
  generateMarkdownPreview: GenerateMarkdownPreview;
  toolbarCommands: ToolbarGroups;
  commands: CommandMap;
  getIcon?: GetIcon;
  loadingPreview?: React.ReactNode;
  readOnly?: boolean;
  disablePreview?: boolean;
  disableMaximize?: boolean;
  suggestionTriggerCharacters?: string[];
  loadSuggestions?: (text: string) => Promise<Suggestion[]>;
  childProps?: ChildProps;
  paste?: PasteOptions;
  l18n?: L18n;
  textAreaComponent?: any;
  minHeight?: number;
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
    e: React.KeyboardEvent<HTMLTextAreaElement>
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
    event: React.ClipboardEvent<HTMLTextAreaElement>
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
    event: React.DragEvent<HTMLTextAreaElement>
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
    event: React.ChangeEvent<HTMLInputElement>
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
    <div className={`react-mde ${maximized ? 'maximized' : ''}`}>
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
      <div
        className="mde-editor"
        style={{ display: selectedTab !== 'write' ? 'none' : 'flex' }}
      >
        <TextArea
          refObject={textarea}
          onChange={(newValue: string) => {
            if (onChange) {
              onChange(newValue);
            }
          }}
          onPaste={(event: React.ClipboardEvent<HTMLTextAreaElement>) => {
            executePasteCommand(event);
          }}
          onDrop={(event: React.DragEvent<HTMLTextAreaElement>) => {
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
          <label className="image-tip">
            <input
              className="image-input"
              type="file"
              accept="image/*"
              multiple
              onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
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
