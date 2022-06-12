# 📝 @javier.alejandro.castro/react-mde

A simple yet powerful and extensible **React Markdown Editor**. React-mde has no 3rd party dependencies.

- [Demo](https://jacargentina.github.io/react-mde/)

## Installing

    yarn add @javier.alejandro.castro/react-mde

## Markdown Preview

React-mde is agnostic regarding how to preview Markdown. The examples will use [Showdown](https://github.com/showdownjs/showdown)

    yarn add showdown

It is also possible to return a Promise to React Element from `generateMarkdownPreview`, which makes
it possible to use [ReactMarkdown](https://github.com/rexxars/react-markdown) as a preview.

## Using

React-mde is a completely controlled component.

```jsx
import React, { useState } from 'react';
import { ReactMdeProvider, ReactMdeEditor } from '@javier.alejandro.castro/react-mde';
import * as Showdown from 'showdown';

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const App = () => {
  const [value, setValue] = useState('**Hello world!!!**');
  return (
    <div className="container">
      <ReactMdeProvider>
        <ReactMdeEditor
          value={value}
          onChange={setValue}
          generateMarkdownPreview={(markdown) =>
            Promise.resolve(converter.makeHtml(markdown))
          }
        />
      </ReactMdeProvider>
    </div>
  );
};

export default App;
```

### Customizing Icons

React-mde comes with SVG icons extracted from [FontAwesome](https://fontawesome.com/).

You can customize the way icons are resolved by passing your own `getIcon` that will return a ReactNode
given a command name.

```jsx
<ReactMdeProvider
  getIcon={(name) => <MyCustomIcon name={name} />}
  // ...
>
  <ReactMdeEditor {...props} />
</ReactMdeProvider>
```

## ReactMdeProvider Props

The types are described below

- **onTabChange?: (tab: Tab) => void;**
- **getIcon?: GetIcon** An optional set of button content options, to allow custom icon rendering.
- **disableMaximize?: boolean;** Disables the maximize command.
- **initialMaximized?: boolean;** The initial maximized state; defaults to false.
- **onMaximizedChange: (isMaximized: boolean) => void**: Function called when maximized
- **l18n?**: A localization option. It contains the strings `write`, `preview`,`uploadingFile` and `pasteDropSelect`.
- **children: any;** Pass children for adding custom non-ui commands

## ReactMdeEditor Props

The types are described below

- **value: string**: The Markdown value.
- **onChange: (value: string)**: Event handler for the `onChange` event.
  state changes: allow the component user to customize surrounding CSS for allowing to expand to full screen editing.
- **customLayout?**: React.ReactNode: Allows providing a custom toolbar layout, ie. adding new commands.
- **generateMarkdownPreview: (markdown: string) => Promise<string | ReactElement>;**: Function that should return a Promise to the generated HTML or a React element for the preview. If this `prop` is falsy, then no preview is going to be generated.
- **loadingPreview**: What to display in the preview while it is loading. Value can be string, React Element or anything React can render.
- **readOnly?: boolean**: Flag to render the editor in read-only mode.
- **minHeight?: number**: Minimum height for textarea while in write.
- **disablePreview?: boolean**: Flag to disable built-in preview, when you need to handle it outside the component.
- **loadSuggestions?: (text: string, triggeredBy: string) => Promise<Suggestion[]>**: Function to load mention suggestions based on the
  given `text` and `triggeredBy` (character that triggered the suggestions). The result should be an array of `{preview: React.ReactNode, value: string}`.
  The `preview` is what is going to be displayed in the suggestions box. The `value` is what is going to be inserted in the `textarea` on click or enter.
- **suggestionTriggerCharacters (string[])**: Characters that will trigger mention suggestions to be loaded. This property is useless
  without `loadSuggestions`.
- **childProps?: [Object](https://github.com/jacargentina/react-mde/blob/master/flow-typed/Child-props.js)**: An object containing props to be passed to `textArea`.

## XSS concerns

React-mde does not automatically sanitize the HTML preview. If your using Showdown,
this has been taken from [their documentation](<https://github.com/showdownjs/showdown/wiki/Markdown's-XSS-Vulnerability-(and-how-to-mitigate-it)>):

> Cross-side scripting is a well known technique to gain access to private information of the users
> of a website. The attacker injects spurious HTML content (a script) on the web page which will read
> the user’s cookies and do something bad with it (like steal credentials). As a countermeasure,
> you should filter any suspicious content coming from user input. Showdown doesn’t include an
> XSS filter, so you must provide your own. But be careful in how you do it…

You might want to take a look at [showdown-xss-filter](https://github.com/VisionistInc/showdown-xss-filter).

It is also possible to return a Promise to a React Element from `generateMarkdownPreview`, which makes
it possible to use [ReactMarkdown](https://github.com/rexxars/react-markdown) as a preview. ReactMarkdown has built-in XSS protection.

## Licence

React-mde is [MIT licensed](https://github.com/jacargentina/react-mde/blob/master/LICENSE).

## Fork

This started as a fork of https://github.com/andrerpena/react-mde to enable additional features
