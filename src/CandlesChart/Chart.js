import { dispatch as d3Dispatch } from 'd3-dispatch';
import React, { memo, useEffect, useMemo, useRef } from 'react';
import InnerChartDrawings from './components/ChartDrawings';
import Crosshair from './components/Crosshair';
import Dispatcher from './components/Dispatcher';
import Header from './components/Header';
import IndicatorWindows from './components/IndicatorWindows';
import InnerChart from './components/InnerChart';
import { Layer, Rect, Stage } from './components/konva';
import Loader from './components/Loader';
import MenusOverlay from './components/MenusOverlay';
import OhlcvOverlay from './components/OhlcvOverlay';
import WaterMarkOverlay from './components/WaterMarkOverlay';
import XAxis from './components/XAxis';
import YAxis from './components/YAxis';
import GlobalStyle from './GlobalStyle';
import createSetCursor from './modules/createSetCursor';
import getRefs from './modules/getRefs';
import isEqualProps from './modules/isEqualProps';
import useConfig from './modules/useConfig';
import { Context } from './modules/useContext';
import useData from './modules/useData';
import useFrame from './modules/useFrame';

const jstr = JSON.stringify;

// https://konvajs.org/docs/performance/All_Performance_Tips.html
function Chart({
  fwdRef,
  data: instanceData,
  config: instanceConfig,
  loading,
  onLoadMore,
  onTimeframeChange,
  onSymbolClick,
  onDrawings,
  onFullscreen,
  onConfig,
}) {
  const stageRef = useRef();
  const dispatch = useMemo(
    () =>
      d3Dispatch(
        'mousemove',
        'pointerdown',
        'pointerup',
        'zoom',
        'zoomX',
        'zoomY',
        'resetZoom',
        'rerender',
        'dragX',
        'dragY',
        'scale',
        'candle',
        'hoverDrawing',
        'removeDrawing',
        'removeDrawings',
        'contextmenu',
      ),
    [],
  );
  const [config, setConfig] = useConfig(instanceConfig);
  const data = useData(
    instanceData,
    config.initialCandlesWindow,
    config.symbol.code,
    config.timeframe,
    dispatch,
  );
  const frame = useFrame(config, data);
  const setCursor = createSetCursor(stageRef);

  useEffect(() => {
    if (typeof onFullscreen === 'function') {
      onFullscreen(config.fullscreen);
    }
  }, [onFullscreen, config.fullscreen]);

  useEffect(() => {
    if (typeof onConfig === 'function') {
      onConfig(config);
    }
  }, [jstr(config)]);

  useEffect(() => {
    // create container if it doesn't exist
    if (!document.getElementById('streamlined-container')) {
      const container = document.createElement('div');
      container.id = 'streamlined-container';
      container.className = 'streamlined-chart-html';
      document.body.appendChild(container);
    }
  }, []);

  const context = {
    stageRef,
    config,
    setConfig,
    data,
    frame,
    setCursor,
    dispatch,
  };

  if (!frame) {
    return null;
  }

  return (
    <>
      <GlobalStyle theme={config.theme} />
      <Stage
        ref={getRefs(fwdRef, stageRef)}
        width={config.width}
        height={config.height}
      >
        <Context.Provider value={context}>
          <Layer>
            <Rect
              x={0}
              y={0}
              width={config.width}
              height={config.width}
              cornerRadius={config.theme.borderRadius}
              fill={config.theme.bgColor}
            />
          </Layer>
          <Header
            onTimeframeChange={onTimeframeChange}
            onSymbolClick={onSymbolClick}
          />
          <YAxis />
          <XAxis />
          <InnerChart />
          <InnerChartDrawings onDrawings={onDrawings} />
          <IndicatorWindows />
          <Crosshair />
          <OhlcvOverlay />
          <MenusOverlay />
          <WaterMarkOverlay loading={loading} />
          <Dispatcher onLoadMore={onLoadMore} />
          <Loader loading={loading} />
        </Context.Provider>
      </Stage>
    </>
  );
}

export default memo(Chart, isEqualProps);
