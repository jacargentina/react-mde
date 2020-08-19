// @flow
import * as React from 'react';
import { useEffect, useState } from 'react';
import { colors, paddings } from './theme';
import css from 'styled-jsx/css';

export interface PreviewProps {
  refObject?: RefObj<HTMLDivElement>;
  loadingPreview?: React.Node;
  minHeight: number;
  generateMarkdownPreview: GenerateMarkdownPreview;
  markdown: string;
}

export const Preview = (props: PreviewProps) => {
  const { minHeight, markdown, loadingPreview, refObject } = props;
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState();
  const finalHtml = loading ? loadingPreview : preview;

  const generatePreview = () => {
    const { markdown, generateMarkdownPreview } = props;
    setLoading(true);
    generateMarkdownPreview(markdown).then(preview => {
      setPreview(preview);
      setLoading(false);
    });
  };

  useEffect(() => {
    generatePreview();
  }, [markdown]);

  let content;

  const mdStyle = css`
    p,
    blockquote,
    ul,
    ol,
    dl,
    table,
    pre {
      margin-top: 0;
      margin-bottom: 16px;
    }

    h1,
    h2,
    h3 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.3em;
    }
    h1 {
      font-size: 1.6em;
    }
    h2 {
      font-size: 1.4em;
    }
    h3 {
      font-size: 1.2em;
    }
    ul,
    ol {
      padding-left: 2em;
    }

    blockquote {
      margin-left: 0;
      padding: 0 1em;
      color: #777;
      border-left: 0.25em solid #ddd;
    }

    blockquote > :first-child {
      margin-top: 0;
    }

    blockquote > :last-child {
      margin-bottom: 0;
    }

    code {
      padding: 0.2em 0 0.2em 0;
      margin: 0;
      font-size: 90%;
      background-color: rgba(0, 0, 0, 0.04);
      border-radius: 3px;
    }

    code::before,
    code::after {
      letter-spacing: -0.2em;
      content: ${'\\00a0'};
    }

    pre {
      padding: 16px;
      overflow: auto;
      font-size: 85%;
      line-height: 1.45;
      background-color: #f7f7f7;
      border-radius: 3px;
    }

    pre code {
      display: inline;
      padding: 0;
      margin: 0;
      overflow: visible;
      line-height: inherit;
      word-wrap: normal;
      background-color: transparent;
      border: 0;
    }

    pre code::before,
    pre code::after {
      content: none;
    }

    pre > code {
      padding: 0;
      margin: 0;
      font-size: 100%;
      word-break: normal;
      white-space: pre;
      background: transparent;
      border: 0;
    }

    pre a {
      color: #4078c0;
      text-decoration: none;
    }

    pre a:hover {
      text-decoration: underline;
    }

    pre table {
      display: block;
      width: 100%;
      border-spacing: 0;
      border-collapse: collapse;
    }

    pre table thead th {
      font-weight: bold;
    }

    pre table th,
    pre table td {
      padding: 6px 13px;
      border: 1px solid ${colors.border};
    }

    > *:first-child {
      margin-top: 0 !important;
    }

    > *:last-child {
      margin-bottom: 0 !important;
    }

    ::after {
      display: table;
      clear: both;
      content: '';
    }
  `;

  if (typeof finalHtml === 'string') {
    content = (
      <div
        style={{ padding: paddings.preview }}
        dangerouslySetInnerHTML={{ __html: finalHtml || '<p>&nbsp;</p>' }}
        ref={refObject}>
        <style jsx>{mdStyle}</style>
      </div>
    );
  } else {
    content = (
      <div style={{ padding: paddings.preview }}>
        <style jsx>{mdStyle}</style>
        {finalHtml}
      </div>
    );
  }

  return (
    <div style={{ minHeight: minHeight + 10 }} data-testid="mde-preview">
      {content}
    </div>
  );
};
