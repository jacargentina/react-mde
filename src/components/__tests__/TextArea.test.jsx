// @flow

import * as React from 'react';
import { render, cleanup } from '@testing-library/react';
import { TextArea } from '../TextArea';

declare var describe: Function;
declare var it: Function;
declare var expect: Function;
declare var afterEach: Function;
declare var beforeEach: Function;
declare var jest: any;

afterEach(cleanup);

describe('<TextArea />', () => {
  it('loads and displays value', () => {
    const value = '# awesome title';
    const onChange = jest.fn();
    const onPaste = jest.fn();
    const onDrop = jest.fn();

    const { getByText } = render(
      <TextArea
        value={value}
        onChange={onChange}
        onPaste={onPaste}
        onDrop={onDrop}
      />
    );

    expect(getByText(value));
  });
});
