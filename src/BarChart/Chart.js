import inRange from 'lodash/inRange';
import maxBy from 'lodash/maxBy';
import React, { useEffect, useRef, useState } from 'react';
import ControlSlider from './components/ControlSlider';
import Header from './components/Header';
import InnerChart from './components/InnerChart';
import { Layer, Rect, Stage } from './components/konva';
import MobileDivOverlay from './components/MobileDivOverlay';
import XAxis from './components/XAxis';
import YAxis from './components/YAxis';
import useCallbacks from './modules/useCallbacks';
import useConfig from './modules/useConfig';
import { Context } from './modules/useContext';
import useFrame from './modules/useFrame';
import useScales from './modules/useScales';
import onVisibilityChange from './modules/visibilityChange';

function Chart({ fwdRef, title, data, config: cfg, slider }) {
  const layerRef = useRef();
  const [barData, setBarData] = useState(data);
  const config = useConfig({ title, data: barData, ...cfg });
  const frame = useFrame(config);
  const scales = useScales(frame, config);
  const [dispatch, on, off] = useCallbacks();
  const [cursor, setCursor] = useState('default');
  const [menuItems, setMenuItems] = useState({});
  const [activeScale, setActiveScale] = useState(0);
  const [renderKey, setRenderKey] = useState(0);

  // slider
  const steps = maxBy(data, dataSeries => dataSeries?.series?.length)?.series
    ?.length;
  const [slices, setSlices] = useState(config.initSlices);
  const [sliceStart, sliceEnd] = slices;

  useEffect(() => {
    setSlices(config.initSlices);
  }, [steps]);

  useEffect(() => {
    setBarData(
      [...(data || [])].map(dataSeries => {
        return {
          ...dataSeries,
          series: [...(dataSeries?.series || [])].slice(
            Math.max(0, steps + sliceStart),
            steps + sliceEnd,
          ),
        };
      }),
    );
  }, [data, sliceStart, sliceEnd]);

  useEffect(() => {
    let renderCount = 0;
    onVisibilityChange(visible => {
      if (visible) {
        // trigger state change to force rerender on window focus
        // to fix empty chart phenomenon
        setRenderKey(renderCount++);
      }
    });
  }, []);

  const context = {
    config,
    frame,
    scales,
    cursor,
    setCursor,
    activeScale,
    setActiveScale,
    dispatch,
    on,
    off,
    menuItems,
    setMenuItems,
  };

  const konvaEvent = e => ({
    ...e,
    inInnerChartRange:
      inRange(e.evt.offsetX, frame.innerChart.xStart, frame.innerChart.xEnd) &&
      inRange(e.evt.offsetY, frame.innerChart.yStart, frame.innerChart.yEnd),
  });

  return (
    <div>
      <Stage
        key={renderKey}
        ref={fwdRef}
        width={config.width}
        height={config.height}
        style={{ cursor }}
        onContextMenu={e => e.evt.preventDefault()}
        onClick={e => dispatch('click', konvaEvent(e))}
        onMouseDown={e => dispatch('mousedown', konvaEvent(e))}
        onMouseUp={e => dispatch('mouseup', konvaEvent(e))}
        onMouseMove={e => dispatch('mousemove', konvaEvent(e))}
      >
        <Context.Provider value={context}>
          <Layer ref={layerRef}>
            <Rect
              x={0}
              y={0}
              width={config.width}
              height={config.height}
              fill={config.theme.bgColor}
              cornerRadius={config.theme.borderRadius}
            />
            <Header />
            <XAxis />
            <YAxis />
            <InnerChart layerRef={layerRef} />
          </Layer>
          <MobileDivOverlay />
        </Context.Provider>
      </Stage>
      {slider && (
        <div style={{ paddingTop: config.theme.slider.padding }}>
          <ControlSlider
            max={steps}
            value={slices.map(v => v + steps)}
            onInput={([min, max]) => {
              setSlices([min - steps, max - steps]);
            }}
            theme={config.theme.slider}
          />
        </div>
      )}
    </div>
  );
}

export default Chart;
