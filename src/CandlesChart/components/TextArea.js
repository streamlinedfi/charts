import Div from '@streamlinedfi/div';
import React from 'react';
import { Html } from 'react-konva-utils';
import useContext from '../modules/useContext';

export default function DrawingToolbar({
  currentDrawing,
  isMovingText,
  onTextFocus,
  onTextChange,
  textSizeMapping,
}) {
  const { frame, config } = useContext();

  if (!currentDrawing || currentDrawing.type !== 'text' || isMovingText) {
    return null;
  }

  const { text, textSize, points, color } = currentDrawing;

  return (
    <Html divProps={{ style: { width: '100%' } }}>
      <Div
        // ref={ref => {
        //   if (ref) {
        //     ref.focus();
        //   }
        // }}
        as="textarea"
        $flex
        $innerCenter
        $w="auto"
        $absolute
        $left={Math.min(points[0], points[2]) + 4}
        $top={Math.min(points[1], points[3]) + 3}
        $width={Math.abs(points[2] - points[0]) - 8}
        $height={Math.abs(points[3] - points[1]) - 8}
        $fontSize={textSizeMapping[textSize]}
        $lineHeight={textSizeMapping[textSize] * 1.4}
        $p="0"
        $color={color}
        $background="none"
        $border="none"
        onFocus={onTextFocus}
        onChange={event => onTextChange(event.target.value)}
        value={text}
      />
    </Html>
  );
}
