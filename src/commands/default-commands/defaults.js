// @flow
import headerCommand from './headerCommand';
import boldCommand from './boldCommand';
import italicCommand from './italicCommand';
import strikeThroughCommand from './strikeThroughCommand';
import linkCommand from './linkCommand';
import quoteCommand from './quoteCommand';
import codeCommand from './codeCommand';
import {
  checkedListCommand,
  orderedListCommand,
  unorderedListCommand,
} from './listCommands';
import imageCommand from './imageCommand';
import saveImageCommand from './save-image-command';

export function getDefaultToolbarCommands(): ToolbarGroups {
  return [
    {
      name: 'font',
      items: ['header', 'bold', 'italic', 'strikethrough'],
    },
    { name: 'special', items: ['link', 'quote', 'code', 'image'] },
    {
      name: 'lists',
      items: ['unordered-list', 'ordered-list', 'checked-list'],
    },
  ];
}

export function getDefaultCommandMap(): CommandMap {
  return {
    header: headerCommand,
    bold: boldCommand,
    italic: italicCommand,
    strikethrough: strikeThroughCommand,
    link: linkCommand,
    quote: quoteCommand,
    code: codeCommand,
    image: imageCommand,
    'unordered-list': unorderedListCommand,
    'ordered-list': orderedListCommand,
    'checked-list': checkedListCommand,
    'save-image': saveImageCommand,
  };
}

export function getDefaultSaveImageCommandName() {
  return 'save-image';
}
