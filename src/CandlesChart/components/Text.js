import React, { forwardRef, useRef, useEffect } from 'react';
import { Text as KonvaText, Rect } from './konva';
import useContext from '../modules/useContext';
import removeNilDeep from '../../../modules/removeNilDeep';

function Text({ getWidth, ...props }, parentRef) {
  const textRef = useRef();
  const { config } = useContext();

  const textProps = {
    fontFamily: config.theme.fontFamily,
    fontSize: config.theme.fontSize,
    fontStyle: config.theme.fontStyle,
    fill: config.theme.color,
    ...removeNilDeep(props),
  };

  if (textRef.current?.textWidth && typeof getWidth === 'function') {
    getWidth(textRef.current?.textWidth);
  }

  return (
    <>
      {props.bgFill && textRef.current?.textWidth && (
        <Rect
          x={props.x}
          y={props.y}
          offsetX={props.bgPadding}
          offsetY={props.bgPadding}
          width={textRef.current.textWidth + props.bgPadding * 2}
          height={textProps.fontSize + props.bgPadding * 2}
          fill={props.bgFill}
          transformsEnabled="position"
          perfectDrawEnabled={false}
          listening={false}
        />
      )}
      <KonvaText
        ref={ref => {
          if (getWidth || props.bgFill) {
            textRef.current = ref;
          }
          if (parentRef) {
            // eslint-disable-next-line no-param-reassign
            parentRef.current = ref;
          }
        }}
        transformsEnabled="position"
        perfectDrawEnabled={false}
        listening={false}
        {...textProps}
      />
    </>
  );
}

export default forwardRef(Text);
