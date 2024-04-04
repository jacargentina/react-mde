import * as React from 'react';
import { useEffect, useState } from 'react';
import { GenerateMarkdownPreview, RefObj } from '../index.js';

export type PreviewProps = {
  refObject?: RefObj<HTMLDivElement>;
  loadingPreview?: React.ReactNode;
  generateMarkdownPreview: GenerateMarkdownPreview;
  markdown: string;
};

export const Preview = (props: PreviewProps) => {
  const { markdown, loadingPreview, refObject, generateMarkdownPreview } =
    props;
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<React.ReactNode>();
  const finalHtml = loading ? loadingPreview : preview;

  const generatePreview = () => {
    setLoading(true);
    generateMarkdownPreview(markdown).then((html) => {
      setPreview(html);
      setLoading(false);
    });
  };

  useEffect(() => {
    generatePreview();
  }, [markdown]);

  let content;

  if (typeof finalHtml === 'string') {
    content = (
      <div
        className="react-mde-preview"
        dangerouslySetInnerHTML={{ __html: finalHtml || '<p>&nbsp;</p>' }}
        ref={refObject}
      />
    );
  } else {
    content = <div className="react-mde-preview">{finalHtml}</div>;
  }

  return <div data-testid="react-mde-preview-container">{content}</div>;
};
