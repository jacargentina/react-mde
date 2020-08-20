// @flow
import * as React from 'react';

export type GenerateMarkdownPreview = (markdown: string) => Promise<React.Node>;

/**
 * If the command returns true for a given KeyboardEvent,
 * the command is executed
 */
export type HandleKeyCommand = (
  e: SyntheticKeyboardEvent<HTMLTextAreaElement>
) => boolean;
