import header1Command from './header1Command';
import header2Command from './header2Command';
import header3Command from './header3Command';
import header4Command from './header4Command';
import header5Command from './header5Command';
import header6Command from './header6Command';
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
import { ToolbarGroups, CommandMap } from '~';

export function getDefaultToolbarCommands(): ToolbarGroups {
  return [
    {
      name: 'font',
      items: ['header3', 'bold', 'italic', 'strikethrough'],
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
    header1: header1Command,
    header2: header2Command,
    header3: header3Command,
    header4: header4Command,
    header5: header5Command,
    header6: header6Command,
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
