// @flow
import { readFileAsync } from '../../util/files';
import { getBreaksNeededForEmptyLineBefore } from '../../util/MarkdownUtil';

function dataTransferToArray(items: DataTransferItemList): Array<File> {
  const result = [];
  for (const item of items) {
    if (item.kind === 'file') {
      const asFile = item.getAsFile();
      if (asFile) result.push(asFile);
    }
  }
  return result;
}

function fileListToArray(list: FileList): Array<File> {
  const result = [];
  for (var i = 0; i < list.length; i++) {
    result.push(list[0]);
  }
  return result;
}

const saveImageCommand: Command = {
  async execute({
    initialState,
    textApi,
    context,
    l18n
  }: ExecuteOptions): Promise<void> {
    if (!context.saveImage || !context.event) {
      throw new Error('wrong context');
    }
    const { event, saveImage } = context;

    const clipboardEvt: SyntheticClipboardEvent<HTMLTextAreaElement> = (event: any);
    const dragEvt: SyntheticDragEvent<HTMLTextAreaElement> = (event: any);
    const inputEvt: SyntheticInputEvent<HTMLTextAreaElement> = (event: any);

    const items = clipboardEvt
      ? dataTransferToArray(clipboardEvt.clipboardData.items)
      : dragEvt
      ? dataTransferToArray(dragEvt.dataTransfer.items)
      : inputEvt
      ? fileListToArray(inputEvt.target.files)
      : [];

    items.forEach(async blob => {
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
          end: initialState.selection.start + placeHolder.length
        });

        const realImageMarkdown = `${breaksBefore}![image](${imageUrl})`;

        const selectionDelta = realImageMarkdown.length - placeHolder.length;

        textApi.replaceSelection(realImageMarkdown);
        textApi.setSelectionRange({
          start: newState.selection.start + selectionDelta,
          end: newState.selection.end + selectionDelta
        });
      }
    });
  }
};

export default saveImageCommand;
