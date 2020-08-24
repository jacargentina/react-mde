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
import ReactMde from '@javier.alejandro.castro/react-mde';
import * as Showdown from 'showdown';

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const App = () => {
  const [value, setValue] = useState('**Hello world!!!**');
  const [selectedTab, setSelectedTab] = useState('write');
  return (
    <div className="container">
      <ReactMde
        value={value}
        onChange={setValue}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(converter.makeHtml(markdown))
        }
      />
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
<ReactMde
  getIcon={(commandName) => <MyCustomIcon name={commandName} />}
  onChange={this.handleValueChange}
  // ...
/>
```

## React-mde Props

The types are described below

- **value: string**: The Markdown value.
- **selectedTab: "write" | "preview"**: The currently selected tab.
- **isMaximized: boolean**: The current maximized state; defaults to false.
- **onChange: (value: string)**: Event handler for the `onChange` event.
- **onTabChange: (tab) => void**: Function called when the selected tab changes.
- **onMaximizedChange: (isMaximized: boolean) => void**: Function called when maximized state changes: allow the component user to customize surrounding CSS for allowing to expand to full screen editing.
- **commands?: Record<string, Command>**: An object with string properties representing keys, and a Command object as value for each key. These are custom commands. Commands are explained in more details below.
- **toolbarCommands?: ToolbarGroups**: Array of ToolbarGroup, indicating which commands should be displayed. Each outer array is a named group. Example: `[{name: 'style' , items: ["bold", "italic"]}, {name: 'lists' , items: ["unordered", "ordered"]}]`
- **generateMarkdownPreview: (markdown: string) => Promise<string | ReactElement>;**: Function that should return a Promise to the generated HTML or a React element for the preview. If this `prop` is falsy, then no preview is going to be generated.
- **getIcon?: (commandName: string) => React.ReactNode }** An optional set of button content options, including an `iconProvider` to allow custom icon rendering.
  options.
- **loadingPreview**: What to display in the preview while it is loading. Value can be string, React Element or anything React can render.
- **readOnly?: boolean**: Flag to render the editor in read-only mode.
- **minHeight?: number**: Minimum height for textarea while in write.
- **disablePreview?: boolean**: Flag to disable built-in preview, when you need to handle it outside the component.
- **disableMaximize?: boolean**: Flag to disable (hide) maximize button.
- **l18n?**: A localization option. It contains the strings `write`, `preview`,`uploadingImage` and `pasteDropSelect`.
- **loadSuggestions?: (text: string, triggeredBy: string) => Promise<Suggestion[]>**: Function to load mention suggestions based on the
  given `text` and `triggeredBy` (character that triggered the suggestions). The result should be an array of `{preview: React.ReactNode, value: string}`.
  The `preview` is what is going to be displayed in the suggestions box. The `value` is what is going to be inserted in the `textarea` on click or enter.
- **suggestionTriggerCharacters (string[])**: Characters that will trigger mention suggestions to be loaded. This property is useless
  without `loadSuggestions`.
- **childProps?: [Object](https://github.com/jacargentina/react-mde/blob/master/flow-typed/Child-props.js)**: An object containing props to be passed to `writeButton`, `previewButton`, `commandButtons` and `textArea`.

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
