// @flow
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

const saveImageCommand: Command = {
  async execute({
    initialState,
    textApi,
    context,
    l18n,
  }: ExecuteOptions): Promise<void> {
    const { event, saveImage } = context;

    let blobs;
    // $FlowIgnore
    if (event.clipboardData) {
      // $FlowIgnore
      blobs = extractBlobs(event.clipboardData.items);
      // $FlowIgnore
    } else if (event.dataTransfer) {
      // $FlowIgnore
      blobs = extractBlobs(event.dataTransfer.items);
      // $FlowIgnore
    } else if (event.target) {
      // $FlowIgnore
      blobs = fileListToBlobs(event.target.files);
    } else {
      blobs = [];
    }

    if (blobs.length > 0) {
      if (!saveImage)
        throw new Error("saveImage config missing, can't handle action");

      blobs.forEach(async (blob) => {
        const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(
          initialState.text,
          initialState.selection.start
        );
        const breaksBefore = Array(breaksBeforeCount + 1).join('\n');

        const placeHolder = `${breaksBefore}![${
          l18n ? l18n.uploadingImage : 'Uploading image...'
        }]()`;

        textApi.replaceSelection(placeHolder);

        const blobContents = await readFileAsync(blob);
        const savingImage = saveImage(blobContents);
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

          const realImageMarkdown = `${breaksBefore}![image](${imageUrl})`;

          const selectionDelta = realImageMarkdown.length - placeHolder.length;

          textApi.replaceSelection(realImageMarkdown);
          textApi.setSelectionRange({
            start: newState.selection.start + selectionDelta,
            end: newState.selection.end + selectionDelta,
          });
        }
      });
      // $FlowIgnore
      event.preventDefault();
    }
  },
};

export default saveImageCommand;
