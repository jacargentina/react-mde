// @flow

export type RefObj<ElementType> = { current: null | ElementType };

export interface Refs {
  textarea?: RefObj<HTMLTextAreaElement>;
  preview?: RefObj<HTMLDivElement>;
}
