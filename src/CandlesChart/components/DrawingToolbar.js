import Div from '@streamlinedfi/div';
import { transparentize } from 'polished';
import React from 'react';
import { Html } from 'react-konva-utils';
import theme from '../../../modules/shared/theme';
import Close from '../../Close';
import Aa from '../assets/Aa.svg';
import HArea from '../assets/harea.svg';
import HLine from '../assets/hline.svg';
import Line from '../assets/line.svg';
import Rect from '../assets/rect.svg';
import Text from '../assets/text.svg';
import VLine from '../assets/vline.svg';
import useContext from '../modules/useContext';

const scaleMapping = {
  small: 0.85,
  medium: 1,
  large: 1.15,
};

const drawingIconMapping = {
  line: Line,
  rect: Rect,
  harea: HArea,
  hline: HLine,
  vline: VLine,
  text: Text,
};

export default function DrawingToolbar({
  currentDrawing,
  onColorChange,
  onTextSizeChange,
  onRemove,
}) {
  const { frame, config } = useContext();
  const { color, textSize } = currentDrawing || {};
  const setColor = onColorChange;
  const setTextSize = onTextSizeChange;

  const colors = [
    config.theme.lineColor,
    config.theme.candleUpColor,
    config.theme.candleDownColor,
    config.theme.title.color,
    config.theme.color,
  ];

  if (!currentDrawing) {
    return null;
  }

  const Icon = drawingIconMapping[currentDrawing.type];

  return (
    <Html divProps={{ style: { width: '100%' } }}>
      <Div
        $flex
        $innerCenter
        $w="auto"
        $absolute
        $top={frame.header.yEnd}
        $left="50%"
        $transform="translateX(-50%)"
        $border={`1px solid ${theme.fill300}`}
        $background={theme.backgroundDarker}
        $h={34}
        $radius={17}
        $px={0.5}
      >
        <Div
          $flex
          $shrink="0"
          $innerCenter
          $w={32}
          $h={32}
          $color={theme.fill800}
        >
          <Icon />
        </Div>
        {colors.map(colorOption => (
          <Div
            as="button"
            key={colorOption}
            $shrink="0"
            $w={16}
            $h={16}
            $mr={0.5}
            $radius={8}
            $background={color === colorOption ? color : undefined}
            $background$hover={
              color === colorOption
                ? undefined
                : transparentize(0.5, colorOption)
            }
            $border={`1.5px solid ${colorOption}`}
            onClick={() => setColor(colorOption)}
          />
        ))}
        {currentDrawing.type === 'text' && (
          <Div $flex $w="auto" $shrink="0" $mr={0.5}>
            {['small', 'medium', 'large'].map(size => (
              <Div
                key={size}
                $flex
                as="button"
                $shrink="0"
                $innerCenter
                $w={32}
                $h={32}
                $radius={16}
                $color={textSize === size ? theme.fill800 : theme.fill500}
                $background={textSize === size ? theme.fill100 : undefined}
                onClick={() => setTextSize(size)}
              >
                <Div as={Aa} $transform={`scale(${scaleMapping[size]})`} />
              </Div>
            ))}
          </Div>
        )}
        <Close
          size={24}
          $position="static"
          $background={theme.fill100}
          onClick={() => onRemove(currentDrawing)}
        />
      </Div>
    </Html>
  );
}
