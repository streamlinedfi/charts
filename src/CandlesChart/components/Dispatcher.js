import Div from '@streamlinedfi/div';
import React, { memo, useRef, useState } from 'react';
import { Html } from 'react-konva-utils';
import isEqualProps from '../modules/isEqualProps';
import {
  useOnLoadMore,
  useXScaleDispatch,
  useYScaleDispatch,
} from '../modules/scales';
import useCandleDispatch from '../modules/useCandleDispatch';
import useContext from '../modules/useContext';
import useZoomDispatch from '../modules/useZoomDispatch';
import { Layer, Rect } from './konva';

const jstr = JSON.stringify;

function Dispatcher({ onLoadMore }) {
  const { config } = useContext();
  const layerRef = useRef();
  useCandleDispatch();
  useZoomDispatch(layerRef);
  useXScaleDispatch();
  useYScaleDispatch();
  useOnLoadMore(onLoadMore);
  const isMobile =
    typeof window !== 'undefined' && typeof document !== 'undefined'
      ? document.body.clientWidth < config.mobileThreshold
      : false;

  // tmp solution to prevent interacting with the chart
  // and allow vertical scrolling of the page on mobile
  // touch seems to be preventing it on canvas
  if (isMobile) {
    return (
      <Layer>
        <Html divProps={{ style: { zIndex: 1, width: '100%' } }}>
          <Div
            $absolute
            $left={0}
            $top={0}
            $width={config.width}
            $height={config.height}
          />
        </Html>
      </Layer>
    );
  }

  return (
    <Layer
      ref={layerRef}
      x={0}
      y={0}
      width={config.width}
      height={config.height}
    >
      <Pointer />
    </Layer>
  );
}

function Pointer() {
  const { config, frame, dispatch, setCursor } = useContext();
  const deltaRef = useRef();
  const [hoverX, setHoverX] = useState();
  const [hoverY, setHoverY] = useState();
  const imagePadding = 4;

  const onPointerDown = ({ evt }) => {
    dispatch.call('pointerdown', null, evt);
    if (config.tool === 'crosshair') {
      setCursor('grabbing');
      document.body.addEventListener(
        'pointerup',
        () => setCursor('crosshair'),
        { once: true },
      );
    }
  };

  const onPointerUp = ({ evt }) => {
    dispatch.call('pointerup', null, evt);
  };

  const onMouseMove = ({ evt }) => {
    dispatch.call('mousemove', null, evt);
  };

  return (
    <>
      <Rect
        key={jstr(frame.mainInner)}
        x={frame.mainInner.xStart}
        y={frame.mainInner.yStart}
        width={frame.mainInner.width}
        height={frame.mainInner.height}
        onMouseEnter={() => setCursor('crosshair')}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        // onTouchStart={onPointerDown}
        // onTouchEnd={onPointerUp}
        onMouseLeave={() => {
          setCursor('default');
          dispatch.call('mousemove', null, null);
        }}
        onMouseMove={onMouseMove}
        // onTouchMove={onMouseMove}
        onContextMenu={({ evt }) => {
          evt.preventDefault();
          dispatch.call('contextmenu', null, evt);
        }}
        transformsEnabled="position"
        perfectDrawEnabled={false}
      />
      <Rect
        key={jstr(frame.yAxis)}
        x={frame.yAxis.xStart}
        y={frame.yAxis.yStart}
        width={frame.yAxis.width}
        height={frame.yAxis.height}
        fill={hoverY ? config.theme.axes.hoverColor : undefined}
        onMouseEnter={() => {
          setCursor('ns-resize');
          setHoverY(true);
        }}
        onMouseLeave={() => {
          setCursor('default');
          setHoverY(false);
        }}
        onPointerDown={({ evt }) => {
          deltaRef.current = {};
          deltaRef.current.initY = evt.offsetY;
          document.body.addEventListener(
            'pointerup',
            () => {
              deltaRef.current = null;
            },
            { once: true },
          );
        }}
        onMouseMove={({ evt }) => {
          if (deltaRef.current) {
            deltaRef.current.deltaY = evt.offsetY - deltaRef.current.initY;
            dispatch.call('dragY', null, { evt, dy: deltaRef.current.deltaY });
            deltaRef.current.initY = evt.offsetY;
          }
        }}
        transformsEnabled="position"
        perfectDrawEnabled={false}
      />
      <Rect
        key={jstr(frame.xAxis)}
        x={frame.xAxis.xStart}
        y={frame.xAxis.yStart}
        width={frame.xAxis.width}
        height={frame.xAxis.height + 8}
        fill={hoverX ? config.theme.axes.hoverColor : undefined}
        onMouseEnter={() => {
          setCursor('ew-resize');
          setHoverX(true);
        }}
        onMouseLeave={() => {
          setCursor('default');
          setHoverX(false);
        }}
        onPointerDown={({ evt }) => {
          deltaRef.current = {};
          deltaRef.current.initX = evt.offsetX;
          document.body.addEventListener(
            'pointerup',
            () => {
              deltaRef.current = null;
            },
            { once: true },
          );
        }}
        onMouseMove={({ evt }) => {
          if (deltaRef.current) {
            deltaRef.current.deltaX = evt.offsetX - deltaRef.current.initX;
            dispatch.call('dragX', null, { evt, dx: deltaRef.current.deltaX });
            deltaRef.current.initX = evt.offsetX;
          }
        }}
        transformsEnabled="position"
        perfectDrawEnabled={false}
      />
      <Rect
        key={jstr(frame.mainChart)}
        x={frame.mainChart.xStart}
        y={frame.mainChart.yEnd - imagePadding * 3 - 28}
        width={103 + imagePadding}
        height={28 + imagePadding * 2}
        onMouseEnter={() => {
          setCursor('pointer');
        }}
        onMouseLeave={() => {
          setCursor('default');
        }}
        onPointerDown={({ evt }) => {
          window.open('https://www.streamlined.finance', '_blank');
        }}
        transformsEnabled="position"
        perfectDrawEnabled={false}
      />
    </>
  );
}

export default memo(Dispatcher, isEqualProps);
