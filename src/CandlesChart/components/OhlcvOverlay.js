import React, { useEffect, useRef } from 'react';
import { transparentize } from 'polished';
import last from 'lodash/last';
import Konva from 'konva';
import { Layer } from './konva';
import useContext from '../modules/useContext';
import useRenderer from '../modules/useRenderer';

function renderOverlay({ config, frame, candle }) {
  const overlayTheme = config.theme.ohlcvOverlay;

  const yStartRow1 = frame.mainChart.yStart + overlayTheme.overlayMarginTop;
  const yStartRow2 =
    yStartRow1 + config.theme.fontSize + overlayTheme.itemMarginBottom;
  const yStartRow3 =
    yStartRow2 + config.theme.fontSize + overlayTheme.itemMarginBottom;

  const keyTextProps = {
    fontFamily: config.theme.fontFamily,
    fontStyle: config.theme.fontStyle,
    fontSize: overlayTheme.fontSize,
    fill: overlayTheme.keyColor,
  };
  const valueTextProps = {
    fontFamily: config.theme.fontFamily,
    fontStyle: config.theme.fontStyle,
    fontSize: overlayTheme.fontSize,
    fill: overlayTheme.valueColor,
  };

  const keyWidthCol1 = new Konva.Text({
    text: 'Volume',
    ...keyTextProps,
  }).getTextWidth();
  const keyWidthCol2 = new Konva.Text({
    text: 'Close',
    ...keyTextProps,
  }).getTextWidth();

  const xStartCol1Value =
    frame.mainChart.xStart + keyWidthCol1 + overlayTheme.itemMarginRight;

  const xStartCol2Key =
    xStartCol1Value +
    Math.ceil(
      Math.max(
        new Konva.Text({
          text: config.formatters.axes.y(candle.high),
          ...keyTextProps,
        }).getTextWidth(),
        new Konva.Text({
          text: config.formatters.axes.y(candle.low),
          ...keyTextProps,
        }).getTextWidth(),
        // new Konva.Text({
        //   text: config.formatters.axes.y(candle.volume),
        //   ...keyTextProps,
        // }).getTextWidth(),
      ),
    ) +
    overlayTheme.colMarginRight;

  const xStartCol2Value =
    xStartCol2Key + keyWidthCol2 + overlayTheme.itemMarginRight;

  const xEndCol2Value =
    xStartCol2Value +
    Math.ceil(
      Math.max(
        new Konva.Text({
          text: config.formatters.axes.y(candle.open),
          ...keyTextProps,
        }).getTextWidth(),
        new Konva.Text({
          text: config.formatters.axes.y(candle.high),
          ...keyTextProps,
        }).getTextWidth(),
        // new Konva.Text({
        //   text: config.formatters.axes.y(candle.volume),
        //   ...keyTextProps,
        // }).getTextWidth(),
      ),
    );

  const overlayBgRectWidth =
    xEndCol2Value + overlayTheme.overlayMarginRight - frame.mainChart.xStart;

  const overlayBgRectHeight =
    yStartRow3 +
    config.theme.fontSize +
    overlayTheme.overlayMarginBottom -
    frame.mainChart.yStart;

  return [
    {
      type: 'Rect',
      attrs: {
        x: frame.mainChart.xStart,
        y: frame.mainChart.yStart,
        width: overlayBgRectWidth,
        height: overlayBgRectHeight,
        fill: transparentize(0.3, config.theme.bgColor),
        cornerRadius: [0, 0, 8, 0],
      },
    },
    {
      type: 'Text',
      attrs: {
        text: 'High',
        x: frame.mainChart.xStart,
        y: yStartRow1,
        ...keyTextProps,
      },
    },
    {
      type: 'Text',
      attrs: {
        text: config.formatters.axes.y(candle.high),
        x: xStartCol1Value,
        y: yStartRow1,
        ...valueTextProps,
      },
    },
    {
      type: 'Text',
      attrs: {
        text: 'Low',
        x: frame.mainChart.xStart,
        y: yStartRow2,
        ...keyTextProps,
      },
    },
    {
      type: 'Text',
      attrs: {
        text: config.formatters.axes.y(candle.low),
        x: xStartCol1Value,
        y: yStartRow2,
        ...valueTextProps,
      },
    },
    {
      type: 'Text',
      attrs: {
        text: 'Volume',
        x: frame.mainChart.xStart,
        y: yStartRow3,
        ...keyTextProps,
      },
    },
    {
      type: 'Text',
      attrs: {
        text: candle.volume?.toLocaleString('en-US'),
        x: xStartCol1Value,
        y: yStartRow3,
        ...valueTextProps,
      },
    },
    // -- next col
    {
      type: 'Text',
      attrs: {
        text: 'Open',
        x: xStartCol2Key,
        y: yStartRow1,
        ...keyTextProps,
      },
    },
    {
      type: 'Text',
      attrs: {
        text: config.formatters.axes.y(candle.open),
        x: xStartCol2Value,
        y: yStartRow1,
        ...valueTextProps,
      },
    },
    {
      type: 'Text',
      attrs: {
        text: 'Close',
        x: xStartCol2Key,
        y: yStartRow2,
        ...keyTextProps,
      },
    },
    {
      type: 'Text',
      attrs: {
        text: config.formatters.axes.y(candle.close),
        x: xStartCol2Value,
        y: yStartRow2,
        ...valueTextProps,
      },
    },
  ];
}

function OhlcvOverlay() {
  const { config, data, dispatch } = useContext();
  const layerRef = useRef();
  const renderer = useRenderer(layerRef.current);

  useEffect(() => {
    const breakpoint = 640;
    if (data.series && config.width >= breakpoint) {
      renderer(renderOverlay, {
        key: 'ohlcvOverlay',
        candle: last(data.series),
      });

      dispatch.on('candle.ohlcvOverlay', candle => {
        renderer(renderOverlay, {
          key: 'ohlcvOverlay',
          candle: candle || last(data.series),
        });
      });
    } else {
      renderer.destroyAll();
      dispatch.on('candle.ohlcvOverlay', null);
    }
  }, [dispatch, data.seriesId, config.width]);

  return <Layer ref={layerRef} />;
}

export default OhlcvOverlay;
