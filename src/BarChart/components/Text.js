import Konva from 'konva';
import React, { forwardRef } from 'react';
import removeNilDeep from '../modules/removeNilDeep';
import useContext from '../modules/useContext';
import { Text as KonvaText, Rect } from './konva';

function Text(props, ref) {
  const { config } = useContext();

  const textProps = {
    fontFamily: config.theme.fontFamily,
    fontSize: config.theme.fontSize,
    fontStyle: config.theme.fontStyle,
    fill: config.theme.color,
    ...removeNilDeep(props),
  };

  function getWidth() {
    return Math.ceil(new Konva.Text(textProps).getTextWidth());
  }

  return (
    <>
      {props.bgFill && (
        <Rect
          x={props.x}
          y={props.y}
          offsetX={props.bgPadding}
          offsetY={props.bgPadding}
          width={getWidth() + props.bgPadding * 2}
          height={textProps.fontSize + props.bgPadding * 2}
          fill={props.bgFill}
        />
      )}
      <KonvaText ref={ref} {...textProps} />
    </>
  );
}

export default forwardRef(Text);
