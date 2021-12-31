import * as React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import * as Showdown from 'showdown';
import { ReactMde } from '../ReactMde';

afterEach(cleanup);

describe('<ReactMde />', () => {
  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  });
  let props;

  beforeEach(() => {
    props = {
      value: 'awesome title',
      onChange: jest.fn(),
      generateMarkdownPreview: (markdown) =>
        Promise.resolve(converter.makeHtml(markdown)),
    };
  });

  it('loads and displays value', async () => {
    const { getByText } = render(<ReactMde {...props} />);

    await waitFor(() => {
      expect(getByText(props.value));
    });
  });

  it('renders <TextArea /> when selectedTab is write', async () => {
    const { getByTestId } = render(<ReactMde {...props} selectedTab="write" />);

    await waitFor(() => {
      expect(getByTestId('text-area'));
    });
  });

  it('renders <MdePreview /> when selectedTab is preview', async () => {
    const { getByTestId } = render(
      <ReactMde {...props} selectedTab="preview" />
    );

    await waitFor(() => {
      expect(getByTestId('react-mde-preview-container'));
    });
  });
});
