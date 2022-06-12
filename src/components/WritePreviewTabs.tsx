import * as React from 'react';
import { useReactMde } from './ReactMdeContext';

export const WritePreviewTabs = () => {
  const reactMde = useReactMde();
  return (
    <div className="react-mde-toolbar-buttons">
      <button
        type="button"
        data-testid="write-button"
        className={reactMde.selectedTab === 'write' ? 'selected' : ''}
        onClick={() => reactMde.setSelectedTab('write')}>
        {reactMde.l18n.write}
      </button>
      <button
        type="button"
        data-testid="preview-button"
        className={reactMde.selectedTab === 'preview' ? 'selected' : ''}
        onClick={() => reactMde.setSelectedTab('preview')}>
        {reactMde.l18n.preview}
      </button>
    </div>
  );
};
