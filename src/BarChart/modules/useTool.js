import { useState, useEffect } from 'react';

export default function useTool(controlTool, onToolChange) {
  const [tool, setTool] = useState('crosshair');

  useEffect(() => {
    if (controlTool) {
      setTool(controlTool);
    }
  }, [controlTool]);

  useEffect(() => {
    if (onToolChange) {
      onToolChange(tool);
    }
  }, [tool]);

  return [tool, setTool];
}
