import * as React from 'react';
import { useEffect } from 'react';
import { L18n, TextApi, TextState, UploadFileHandler } from '../index.js';
import { useReactMde } from '../components/index.js';
import readFileAsync from '../util/files.js';
import { getBreaksNeededForEmptyLineBefore } from '../util/MarkdownUtil.js';

function extractBlobs(items: DataTransferItemList): Array<File> {
  const result = [];
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (item.kind === 'file') {
      const asFile = item.getAsFile();
      if (asFile) result.push(asFile);
    }
  }
  return result;
}

function fileListToBlobs(list: FileList): Array<File> {
  const result = [];
  for (let i = 0; i < list.length; i += 1) {
    result.push(list[0]);
  }
  return result;
}

function isImage(file: File) {
  return file && file.type.split('/')[0] === 'image';
}

function handleBlobsUpload(
  blobs: Array<File>,
  initialState: TextState,
  l18n: L18n,
  textApi: TextApi,
  uploadFile: UploadFileHandler,
): boolean {
  if (blobs.length > 0) {
    var lastPlaceholderState: TextState;
    var blobsUploadedCount: number = 0;
    blobs.forEach(async (blob, blobIndex) => {
      const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(
        initialState.text,
        initialState.selection.start,
      );
      const breaksBefore = Array(breaksBeforeCount + 1).join('\n');

      const placeHolder = `${breaksBefore}![${
        l18n ? l18n.uploadingFile : 'Uploading ...'
      } ${blob.name}]()\n`;

      textApi.replaceSelection(placeHolder);

      var isLast = blobIndex == blobs.length - 1;
      if (isLast) {
        lastPlaceholderState = textApi.getState();
      }

      const blobContents = await readFileAsync(blob);
      const savingImage = uploadFile(blobContents, blob.name);
      const imageUrl = (await savingImage.next()).value;

      const newState = textApi.getState();
      const uploadingTextIndex = newState.text.indexOf(placeHolder);

      if (uploadingTextIndex != -1 && typeof imageUrl === 'string') {
        // In this case, the user did not touch the placeholders. Good user
        // we will replace it with the real one that came from the server
        textApi.setSelectionRange({
          start: uploadingTextIndex,
          end: uploadingTextIndex + placeHolder.length,
        });

        let title = isImage(blob)
          ? blob.name.substring(0, blob.name.lastIndexOf('.')) || blob.name
          : blob.name;

        title = isImage(blob) ? `![${title}]` : `[${title}]`;

        const realImageMarkdown = `${breaksBefore}${title}(${imageUrl})\n`;
        textApi.replaceSelection(realImageMarkdown);
        blobsUploadedCount++;
        if (blobsUploadedCount == blobs.length) {
          textApi.setSelectionRange({
            start: initialState.selection.start,
            end: initialState.selection.start,
          });
        }
      }
    });
    return true;
  }
  return false;
}

export const UploadFilePasteCommand = (props: {
  uploadFile: UploadFileHandler;
}) => {
  const { uploadFile } = props;
  const { getTextState, l18n, textApi, registerEventHandler } = useReactMde();

  useEffect(() => {
    registerEventHandler({
      filter: (e) => {
        const { clipboardData } =
          e as React.ClipboardEvent<HTMLTextAreaElement>;
        return clipboardData != null;
      },
      handler: (e) => {
        const { clipboardData } =
          e as React.ClipboardEvent<HTMLTextAreaElement>;
        let blobs: Array<File> = extractBlobs(clipboardData.items);
        if (
          handleBlobsUpload(blobs, getTextState(), l18n, textApi, uploadFile)
        ) {
          return true;
        }
        return false;
      },
    });
  }, []);

  return null;
};

export const UploadFileDragDropCommand = (props: {
  uploadFile: UploadFileHandler;
}) => {
  const { uploadFile } = props;
  const { getTextState, l18n, textApi, registerEventHandler } = useReactMde();

  useEffect(() => {
    registerEventHandler({
      filter: (e) => {
        const { dataTransfer } = e as React.DragEvent<HTMLTextAreaElement>;
        return dataTransfer != null;
      },
      handler: (e) => {
        const { dataTransfer } = e as React.DragEvent<HTMLTextAreaElement>;
        let blobs: Array<File> = extractBlobs(dataTransfer.items);
        if (
          handleBlobsUpload(blobs, getTextState(), l18n, textApi, uploadFile)
        ) {
          return true;
        }
        return false;
      },
    });
  }, []);

  return null;
};

export const UploadFileInputCommand = (props: {
  uploadFile: UploadFileHandler;
}) => {
  const { uploadFile } = props;
  const { getTextState, l18n, textApi } = useReactMde();
  return (
    <label className="file-tip">
      <input
        className="file-input"
        type="file"
        multiple
        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
          let blobs: Array<File> = fileListToBlobs(event.target.files);
          if (
            handleBlobsUpload(blobs, getTextState(), l18n, textApi, uploadFile)
          ) {
            event.preventDefault();
          }
        }}
      />
      <span>{l18n.pasteDropSelect}</span>
    </label>
  );
};
