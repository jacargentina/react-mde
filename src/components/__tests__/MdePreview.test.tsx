import * as React from 'react';
import * as Showdown from 'showdown';
import { render, cleanup, waitFor } from '@testing-library/react';
import { Preview } from '../Preview';

afterEach(cleanup);

describe('<MdePreview />', () => {
  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  });
  let props;

  beforeEach(() => {
    props = {
      minHeight: 200,
      generateMarkdownPreview: jest.fn((markdown) => {
        return Promise.resolve(converter.makeHtml(markdown));
      }),
    };
  });

  it('renders without crashing', async () => {
    const { getByTestId } = render(<Preview {...props} />);

    await waitFor(() => {
      expect(getByTestId('react-mde-preview-container'));
    });
  });

  it('generates markdown preview after loading', async () => {
    render(<Preview {...props} />);

    await waitFor(() => {
      expect(props.generateMarkdownPreview).toHaveBeenCalled();
    });
  });
});
