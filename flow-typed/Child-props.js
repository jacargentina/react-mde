// @flow

import * as React from 'react';

export type ButtonChildProps = $Rest<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement> & { [key: string]: any, ... },
    HTMLButtonElement
  >,
  { ... }
>;

export type TextAreaChildProps = $Rest<
  React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
      [key: string]: any,
      ...
    },
    HTMLTextAreaElement
  >,
  { ... }
>;

export interface ChildProps {
  writeButton?: ButtonChildProps;
  previewButton?: ButtonChildProps;
  commandButtons?: ButtonChildProps;
  textArea?: TextAreaChildProps;
}
