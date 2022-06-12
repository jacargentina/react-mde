import * as React from 'react';
import { ToolbarButtonGroup } from './ToolbarButtonGroup';
import {
  BoldCommand,
  Header3Command,
  ItalicCommand,
  LinkCommand,
  CodeCommand,
  ImageCommand,
  QuoteCommand,
  OrderedListCommand,
  UnorderedListCommand,
  CheckedListCommand,
  StrikethroughCommand,
} from '../commands';
import ToggleMaximizeCommand from '../commands/ToggleMaximizeCommand';
import { useReactMde } from './ReactMdeContext';

export const ToolbarLayout = (props: { children?: any }) => {
  const { children } = props;
  const reactMde = useReactMde();
  return (
    <>
      <ToolbarButtonGroup key="font">
        <Header3Command />
        <BoldCommand />
        <ItalicCommand />
        <StrikethroughCommand />
      </ToolbarButtonGroup>
      <ToolbarButtonGroup key="special">
        <LinkCommand />
        <QuoteCommand />
        <CodeCommand />
        <ImageCommand />
      </ToolbarButtonGroup>
      <ToolbarButtonGroup key="lists">
        <UnorderedListCommand />
        <OrderedListCommand />
        <CheckedListCommand />
      </ToolbarButtonGroup>
      {children}
      {!reactMde.disableMaximize && (
        <ul className="maximizeRight">
          <ToggleMaximizeCommand />
        </ul>
      )}
    </>
  );
};

export default ToolbarLayout;
