import Div from '@streamlinedfi/div';
import React, { useEffect, useRef, useState } from 'react';
import { disableScroll, enableScroll } from '../modules/preventScroll';
import useSize from '../modules/useSize';

const Thumb = ({ left, right, value, scale, max, onMove, theme, ...props }) => {
  const deltaRef = useRef();

  const handleMouseMove = event => {
    /* eslint-disable no-param-reassign */
    if (deltaRef.current) {
      const isTouch = event.type === 'touchmove';
      deltaRef.current.deltaX =
        (isTouch ? event.touches[0].clientX : event.clientX) -
        deltaRef.current.initX;
      const dx = deltaRef.current.deltaX;

      if (left) {
        const nextX = Math.min(Math.max(0, scale(value[0]) + dx), scale(max));
        const nextValue = scale.invert(nextX);

        onMove(
          nextValue < value[1] ? [nextValue, value[1]] : [value[1], nextValue],
        );
      } else {
        const nextX = Math.min(Math.max(0, scale(value[1]) + dx), scale(max));
        const nextValue = scale.invert(nextX);

        onMove(
          nextValue > value[0] ? [value[0], nextValue] : [nextValue, value[0]],
        );
      }

      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      } else if (document.selection) {
        document.selection.empty();
      }
    }
  };

  const handlePointerDown = event => {
    const isTouch = event.type === 'touchstart';
    deltaRef.current = {};
    deltaRef.current.initX = isTouch ? event.touches[0].clientX : event.clientX;
    disableScroll();

    document.body.addEventListener(
      isTouch ? 'touchmove' : 'mousemove',
      handleMouseMove,
    );

    document.body.addEventListener(
      isTouch ? 'touchend' : 'pointerup',
      () => {
        document.body.removeEventListener(
          isTouch ? 'touchmove' : 'mousemove',
          handleMouseMove,
        );
        deltaRef.current = null;
        enableScroll();
      },
      { once: true },
    );
  };

  return (
    <Div
      as="button"
      type="button"
      // role="slider"
      aria-label={`Slider Thumb ${left ? 'Lower' : 'Upper'}`}
      $absolute
      $flex
      $top={-10}
      $left={left ? -16 : undefined}
      $right={right ? -16 : undefined}
      $innerCenter
      $w={32}
      $h={32}
      $radius={16}
      $cursor="ew-resize"
      $background={theme.thumbBackground}
      $border={theme.thumbBorder}
      $boxShadow="0 0 2px 1px rgba(0, 0, 0, .3)"
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      {...props}
    >
      <Div
        $w={1.5}
        $h={12}
        $background={theme.thumbHandleLineColor}
        $mr="2px"
      />
      <Div $w={1.5} $h={12} $background={theme.thumbHandleLineColor} />
    </Div>
  );
};

export default function ControlSlider({ max, value, onInput, theme }) {
  const ref = useRef();
  const scaleRef = useRef();
  const [scaleLoaded, setScaleLoaded] = useState();
  const [width] = useSize(ref);
  const scale = scaleRef.current;
  const [leftValue, rightValue] = value;

  useEffect(() => {
    if (width) {
      import('d3-scale').then(({ scaleLinear }) => {
        scaleRef.current = scaleLinear()
          .domain([0, max])
          .range([0, width]);

        setScaleLoaded(true);
      });
    }
  }, [max, width]);

  return (
    <Div $px={1}>
      <Div
        ref={ref}
        $relative
        $h={12}
        $w="100%"
        $radius={theme.borderRadius}
        $background={theme.background}
        $border={theme.border}
      >
        {scaleLoaded && (
          <Div
            $absolute
            $h={12}
            $left={Math.max(0, scale(leftValue))}
            $right={Math.min(width, width - scale(rightValue))}
            $background={theme.filledTrackColor}
            $border={theme.filledTrackBorderColor}
          >
            <Thumb
              left
              value={value}
              scale={scale}
              max={max}
              onMove={onInput}
              theme={theme}
            />
            <Thumb
              right
              value={value}
              scale={scale}
              max={max}
              onMove={onInput}
              theme={theme}
            />
          </Div>
        )}
      </Div>
    </Div>
  );
}
