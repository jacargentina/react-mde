import * as React from 'react';
import { ToolbarButton, useReactMde } from '../components/index.js';

const ToggleMaximizeCommand = () => {
  const { getIcon, setMaximized } = useReactMde();

  return (
    <ToolbarButton
      name="maximize"
      readOnly={false}
      onClick={() => setMaximized((current) => !current)}>
      {getIcon('maximize')}
    </ToolbarButton>
  );
};

export default ToggleMaximizeCommand;
