import { Command, ExecuteOptions } from '../..';
import readFileAsync from '../../util/files';
import { getBreaksNeededForEmptyLineBefore } from '../../util/MarkdownUtil';

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

const uploadFileCommand: Command = {
  async execute({
    initialState,
    textApi,
    context,
    l18n,
  }: ExecuteOptions): Promise<void> {
    const { event, uploadFile } = context;

    let blobs: Array<File>;
    if (event && 'clipboardData' in event) {
      blobs = extractBlobs(event.clipboardData.items);
    } else if (event && 'dataTransfer' in event) {
      blobs = extractBlobs(event.dataTransfer.items);
    } else if (event && 'target' in event && 'files' in event.target) {
      blobs = fileListToBlobs(event.target.files);
    } else {
      blobs = [];
    }

    if (blobs.length > 0) {
      if (!uploadFile)
        throw new Error("uploadFile config missing, can't handle action");

      blobs.forEach(async (blob) => {
        const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(
          initialState.text,
          initialState.selection.start
        );
        const breaksBefore = Array(breaksBeforeCount + 1).join('\n');

        const placeHolder = `${breaksBefore}![${
          l18n ? l18n.uploadingFile : 'Uploading ...'
        }]()`;

        textApi.replaceSelection(placeHolder);

        const blobContents = await readFileAsync(blob);
        const savingImage = uploadFile(blobContents, blob.name);
        const imageUrl = (await savingImage.next()).value;

        const newState = textApi.getState();

        const uploadingText = newState.text.substr(
          initialState.selection.start,
          placeHolder.length
        );

        if (uploadingText === placeHolder && typeof imageUrl === 'string') {
          // In this case, the user did not touch the placeholder. Good user
          // we will replace it with the real one that came from the server
          textApi.setSelectionRange({
            start: initialState.selection.start,
            end: initialState.selection.start + placeHolder.length,
          });

          let title = isImage(blob)
            ? blob.name.substring(0, blob.name.lastIndexOf('.')) || blob.name
            : blob.name;

          title = isImage(blob) ? `![${title}]` : `[${title}]`;

          const realImageMarkdown = `${breaksBefore}${title}(${imageUrl})`;
          const selectionDelta = realImageMarkdown.length - placeHolder.length;

          textApi.replaceSelection(realImageMarkdown);
          textApi.setSelectionRange({
            start: newState.selection.start + selectionDelta,
            end: newState.selection.end + selectionDelta,
          });
        }
      });
      event?.preventDefault();
    }
  },
};

export default uploadFileCommand;