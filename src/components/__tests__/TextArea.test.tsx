import * as React from 'react';
import { render, cleanup } from '@testing-library/react';
import { TextArea } from '../TextArea';
import { ReactMdeProvider } from '../ReactMdeContext';

afterEach(cleanup);

describe('<TextArea />', () => {
  it('loads and displays value', () => {
    const value = '# awesome title';
    const onChange = jest.fn();

    const { getByText } = render(
      <ReactMdeProvider>
        <TextArea value={value} onChange={onChange} />
      </ReactMdeProvider>
    );

    expect(getByText(value));
  });
});
