import * as React from 'react';
import { WritePreviewTabs } from './WritePreviewTabs';
import ToolbarLayout from './ToolbarLayout';

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
