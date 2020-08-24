// @flow

export type ButtonChildProps = { [key: string]: any };

export type TextAreaChildProps = { [key: string]: any };

export interface ChildProps {
  writeButton?: ButtonChildProps;
  previewButton?: ButtonChildProps;
  commandButtons?: ButtonChildProps;
  textArea?: TextAreaChildProps;
}
