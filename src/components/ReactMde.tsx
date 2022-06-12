import * as React from 'react';
import { Preview } from './Preview';
import { Toolbar } from './Toolbar';
import { TextArea } from './TextArea';
import SvgIcon from './SvgIcon';
import {
  ChildProps,
  GenerateMarkdownPreview,
  GetIcon,
  L18n,
  Suggestion,
  UploadFileHandler,
} from '..';
import { ReactMdeProvider, useReactMde } from './ReactMdeContext';
import {
  UploadFileDragDropCommand,
  UploadFileInputCommand,
  UploadFilePasteCommand,
} from '../commands';

export type ReactMdeProps = {
  value: string;
  onChange: (value: string) => void;
  generateMarkdownPreview: GenerateMarkdownPreview;
  customLayout?: React.ReactNode;
  uploadFile?: UploadFileHandler;
  getIcon?: GetIcon;
  loadingPreview?: React.ReactNode;
  readOnly?: boolean;
  disablePreview?: boolean;
  disableMaximize?: boolean;
  onMaximizedChange?: (isMaximized: boolean) => void;
  suggestionTriggerCharacters?: string[];
  loadSuggestions?: (text: string) => Promise<Suggestion[]>;
  childProps?: ChildProps;
  l18n?: L18n;
  textAreaComponent?: any;
  minHeight?: number;
  children?: any;
};

const ReactMdeEditor = (props: ReactMdeProps) => {
  const {
    customLayout,
    loadingPreview,
    readOnly = false,
    disablePreview = false,
    value,
    childProps = {},
    generateMarkdownPreview,
    loadSuggestions,
    suggestionTriggerCharacters = ['@'],
    textAreaComponent,
    onChange,
    minHeight,
    uploadFile,
  } = props;

  const { maximized, preview, selectedTab } = useReactMde();

  return (
    <div className={`react-mde ${maximized ? 'maximized' : ''}`}>
      <Toolbar customLayout={customLayout} disablePreview={disablePreview} />
      <div
        className="react-mde-editor"
        style={{ display: selectedTab !== 'write' ? 'none' : 'flex' }}>
        <TextArea
          onChange={(newValue: string) => {
            if (onChange) {
              onChange(newValue);
            }
          }}
          readOnly={readOnly}
          maximized={maximized}
          textAreaComponent={textAreaComponent}
          textAreaProps={childProps.textArea}
          value={value}
          suggestionTriggerCharacters={suggestionTriggerCharacters}
          loadSuggestions={loadSuggestions}
          minHeight={minHeight}
        />
        {uploadFile && (
          <>
            <UploadFilePasteCommand uploadFile={uploadFile} />
            <UploadFileDragDropCommand uploadFile={uploadFile} />
            <UploadFileInputCommand uploadFile={uploadFile} />
          </>
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

export const ReactMde = (props: ReactMdeProps) => {
  return (
    <ReactMdeProvider {...props}>
      <ReactMdeEditor {...props} />
      {props.children}
    </ReactMdeProvider>
  );
};
