import * as React from 'react';
import { WritePreviewTabs } from './WritePreviewTabs.js';
import ToolbarLayout from './ToolbarLayout.js';

export type ToolbarProps = {
  customLayout?: React.ReactNode;
  disablePreview: boolean;
};

export const Toolbar = (props: ToolbarProps) => {
  const { disablePreview = false, customLayout } = props;

  return (
    <div className="react-mde-toolbar">
      {!disablePreview && <WritePreviewTabs />}
      {customLayout || <ToolbarLayout />}
    </div>
  );
};
