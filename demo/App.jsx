// @flow
import React, { useState } from 'react';
import * as Showdown from 'showdown';
import ReactMde from '../src';
import pkg from '../package.json';

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const App = () => {
  const [value, setValue] = useState('**Hello world!!!**');
  const [tab, setTab] = useState('write');
  const [maximized, setMaximized] = useState(false);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
  };

  const handleTabChange = (name: string) => {
    setTab(name);
  };

  const handleMaximizedChange = (isMaximized: boolean) => {
    setMaximized(isMaximized);
  };

  const loadSuggestions = async (text: string) => {
    return new Promise<Suggestion[]>((accept) => {
      setTimeout(() => {
        const suggestions: Suggestion[] = [
          {
            preview: 'Andre',
            value: '@andre',
          },
          {
            preview: 'Angela',
            value: '@angela',
          },
          {
            preview: 'David',
            value: '@david',
          },
          {
            preview: 'Louise',
            value: '@louise',
          },
        ].filter((i) => i.preview.toLowerCase().includes(text.toLowerCase()));
        accept(suggestions);
      }, 250);
    });
  };

  const save: SaveImageHandler = async function* (data: ArrayBuffer) {
    // Promise that waits for "time" milliseconds
    const wait = function (time: number) {
      return new Promise((a, r) => {
        setTimeout(() => a(), time);
      });
    };

    // Upload "data" to your server
    // Use XMLHttpRequest.send to send a FormData object containing
    // "data"
    // Check this question: https://stackoverflow.com/questions/18055422/how-to-receive-php-image-data-over-copy-n-paste-javascript-with-xmlhttprequest

    await wait(2000);
    // yields the URL that should be inserted in the markdown
    yield 'https://picsum.photos/300';
    await wait(2000);

    // returns true meaning that the save was successful
    return true;
  };

  return (
    <div className="app">
      <style jsx global>
        {`
          body {
            margin: 0;
          }
        `}
      </style>
      <style jsx>
        {`
          .app {
            display: ${maximized ? 'flex' : 'block'};
            max-width: ${maximized ? 'none' : '650px'};
            height: ${maximized ? 'auto' : '600px'};
            padding: 10px;
            margin: 0 auto;
            flex: 1;
          }

          .header {
            display: ${maximized ? 'none' : 'flex'};
            padding: 20px 0;
          }

          .title {
            font-size: 30px;
            line-height: 30px;
            flex: 1;
          }

          .project {
            border: 1px solid #eaeaea;
            background-color: #efefef;
            border-radius: 4px;
            padding: 0 4px;
            white-space: nowrap;
            vertical-align: bottom;
            line-height: 30px;
            flex: 0;
            color: gray;
          }

          .icon,
          .version {
            vertical-align: middle;
            display: inline-block;
          }

          .version {
            padding-left: 6px;
          }
        `}
      </style>
      <div className="header">
        <div className="title">{pkg.name}</div>
        <a className="project" href={pkg.homepage}>
          <span className="icon">
            <svg height="22" width="22" viewBox="0 0 16 16" version="1.1">
              <path
                fillRule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
          </span>
          <span className="version">{`v${pkg.version}`}</span>
        </a>
      </div>
      <ReactMde
        isMaximized={maximized}
        onChange={handleValueChange}
        onTabChange={handleTabChange}
        onMaximizedChange={handleMaximizedChange}
        value={value}
        generateMarkdownPreview={(markdown) => {
          return Promise.resolve(converter.makeHtml(markdown));
        }}
        selectedTab={tab}
        loadSuggestions={loadSuggestions}
        suggestionTriggerCharacters={['@']}
        paste={{
          saveImage: save,
        }}
      />
    </div>
  );
};

export default App;
