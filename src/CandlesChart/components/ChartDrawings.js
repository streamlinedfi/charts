/* eslint-disable consistent-return */
/* eslint-disable no-unused-expressions */
import React, { useRef, useEffect, useCallback, useState } from 'react';
import inRange from 'lodash/inRange';
import chunk from 'lodash/chunk';
import last from 'lodash/last';
import { Layer } from './konva';
import useContext from '../modules/useContext';
import useRenderer from '../modules/useRenderer';
import useScales from '../modules/useScales';
import renderDrawing, { textSizeMapping } from '../renderers/drawing';
import DrawingToolbar from './DrawingToolbar';
import TextArea from './TextArea';

const { stringify: jstr } = JSON;
const { keys, values, fromEntries, entries } = Object;

function getAnchorPoints(nodeAttrs, event) {
  const pointsEntries = nodeAttrs.anchor.selection.map(i => [
    nodeAttrs.anchor.points[i],
    i,
  ]);
  const anchorPoints = chunk(pointsEntries, 2);
  const selectedAnchorPoint = anchorPoints.find(([[x], [y]]) => {
    return (
      inRange(event.offsetX, x - 5, x + 5) &&
      inRange(event.offsetY, y - 5, y + 5)
    );
  });

  return values(fromEntries(selectedAnchorPoint || pointsEntries));
}

function findAvailableKey(drawings) {
  return keys(drawings).length;
}

export default function ChartDrawings({ onDrawings }) {
  const { frame, config, setConfig, setCursor, dispatch } = useContext();
  const layerRef = useRef();
  const renderer = useRenderer(layerRef.current);
  const scales = useScales('drawings');
  const drawingsRef = useRef({});
  const [currentDrawing, setCurrentDrawing] = useState(null);
  const [isMovingText, setIsMovingText] = useState(false);
  const currentDrawingRef = useRef(null);
  const hoveringDrawingRef = useRef(null);
  const movingDrawingRef = useRef(null);

  const getCurrentDrawing = () =>
    drawingsRef.current[currentDrawingRef.current];

  const getNode = event => {
    const nodes = layerRef.current?.getAllIntersections({
      x: event.offsetX,
      y: event.offsetY,
    });
    return last(nodes);
  };

  const callOnDrawings = () => {
    if (typeof onDrawings === 'function') {
      onDrawings(drawingsRef.current);
    }
  };

  useEffect(() => {
    renderer.destroyAll();
    drawingsRef.current = {};
    currentDrawingRef.current = null;
    hoveringDrawingRef.current = null;
    movingDrawingRef.current = null;
    setCurrentDrawing(null);
  }, [config.timeframe]);

  const addDrawing = useCallback(
    event => {
      const key = findAvailableKey(drawingsRef.current);
      const xValue = scales.x.invert(event.offsetX);
      const yValue = scales.y.invert(event.offsetY);

      const drawing = {
        key,
        type: config.tool,
        domainPoints: [xValue, yValue],
        points: [event.offsetX, event.offsetY],
        isSelected: true,
        color: config.theme.lineColor,
      };

      drawingsRef.current[key] = drawing;
      currentDrawingRef.current = key;

      if (drawing.type === 'text') {
        const addX = event.offsetX + 120;
        const addY = event.offsetY + 80;
        const addXValue = scales.x.invert(addX);
        const addYValue = scales.y.invert(addY);
        drawing.domainPoints = [...drawing.domainPoints, addXValue, addYValue];
        drawing.points = [...drawing.points, addX, addY];
        drawing.color = config.theme.title.color;
        drawing.text = 'Text';
        drawing.textSize = 'medium';
      }

      // finalize for tools with only 1 point
      if (['hline', 'vline', 'text'].includes(drawing.type)) {
        setConfig({
          ...config,
          tool: 'crosshair',
        });
        setCurrentDrawing(drawing);
      }

      callOnDrawings();
      return drawing;
    },
    [config.tool],
  );

  const updateDrawing = useCallback(
    event => {
      const drawing = getCurrentDrawing();
      if (['line', 'rect', 'harea'].includes(drawing.type)) {
        const xValue = scales.x.invert(event.offsetX);
        const yValue = scales.y.invert(event.offsetY);
        const domainPoints = [
          drawing.domainPoints[0],
          drawing.domainPoints[1],
          xValue,
          yValue,
        ];

        const updatedDrawing = {
          ...drawing,
          domainPoints,
          points: drawing.domainPoints.map((value, i) => {
            return (i + 1) % 2 === 1 ? scales.x(value) : scales.y(value);
          }),
        };

        if (event.type !== 'mousemove') {
          setConfig({
            ...config,
            tool: 'crosshair',
          });
          setCurrentDrawing(drawing);
        }

        drawingsRef.current[drawing.key] = updatedDrawing;
        callOnDrawings();
        return updatedDrawing;
      }
    },
    [jstr(config)],
  );

  const moveDrawing = useCallback(event => {
    const drawing = drawingsRef.current[movingDrawingRef.current.key];

    const deltaX = event.offsetX - movingDrawingRef.current.initX;
    const deltaY = event.offsetY - movingDrawingRef.current.initY;

    const points = drawing.points.map((ordinate, i) => {
      if (movingDrawingRef.current.moveablePoints.includes(i)) {
        if (['line', 'rect', 'text'].includes(drawing.type)) {
          return (i + 1) % 2 === 1 ? ordinate + deltaX : ordinate + deltaY;
        }
        if (['hline', 'vline', 'harea'].includes(drawing.type)) {
          return (i + 1) % 2 === 1 ? event.offsetX : event.offsetY;
        }
      }
      return ordinate;
    });

    const domainPoints = drawing.points.map((ordinate, i) => {
      return (i + 1) % 2 === 1
        ? scales.x.invert(ordinate)
        : scales.y.invert(ordinate);
    });

    const updatedDrawing = {
      ...drawing,
      domainPoints,
      points,
    };

    drawingsRef.current[drawing.key] = updatedDrawing;

    if (drawing.type === 'text') {
      setCurrentDrawing({ ...updatedDrawing });
    }

    movingDrawingRef.current.initX = event.offsetX;
    movingDrawingRef.current.initY = event.offsetY;
    callOnDrawings();
    return updatedDrawing;
  }, []);

  const rescaleDrawing = useCallback(drawing => {
    const rescaledDrawing = {
      ...drawing,
      points: drawing.domainPoints.map((value, i) => {
        return (i + 1) % 2 === 1 ? scales.x(value) : scales.y(value);
      }),
    };

    drawingsRef.current[drawing.key] = rescaledDrawing;
    callOnDrawings();
    return rescaledDrawing;
  }, []);

  const hoverDrawing = useCallback(node => {
    const drawing =
      drawingsRef.current[node ? node.attrs.key : hoveringDrawingRef.current];

    if (!drawing) {
      return null;
    }

    if (node) {
      // hover
      hoveringDrawingRef.current = node.attrs.key;

      if (!movingDrawingRef.current) {
        setCursor('move');
      }
    } else {
      // undo hover
      hoveringDrawingRef.current = null;
      setCursor('crosshair');
    }

    const hoveredDrawing = {
      ...drawing,
      isHovering: !!node,
    };

    drawingsRef.current[drawing.key] = hoveredDrawing;
    callOnDrawings();
    return hoveredDrawing;
  }, []);

  const selectDrawing = useCallback(
    (node, event) => {
      const drawing =
        drawingsRef.current[node ? node.attrs.key : currentDrawingRef.current];

      if (node && event) {
        // select node
        const anchorPoints = getAnchorPoints(node.attrs, event);

        currentDrawingRef.current = node.attrs.key;
        setCurrentDrawing(drawing);

        movingDrawingRef.current = {
          key: node.attrs.key,
          initX: event.offsetX,
          initY: event.offsetY,
          moveablePoints: anchorPoints,
        };
        if (node.attrs.text) {
          setIsMovingText(true);
        }
      } else {
        // deselect
        currentDrawingRef.current = null;
        hoveringDrawingRef.current = null;
        setCurrentDrawing(null);
        setIsMovingText(false);
      }

      const selectedDrawing = {
        ...drawing,
        isSelected: !!node,
        isHovering: false,
        isMoving: !!node,
      };

      drawingsRef.current[drawing.key] = selectedDrawing;
      callOnDrawings();
      return selectedDrawing;
    },
    [dispatch],
  );

  const updateAttr = useCallback(
    (key, value) => {
      drawingsRef.current[currentDrawing.key][key] = value;
      setCurrentDrawing({ ...drawingsRef.current[currentDrawing.key] });
      callOnDrawings();
      return drawingsRef.current[currentDrawing.key];
    },
    [jstr(currentDrawing)],
  );

  const removeDrawing = useCallback(
    drawing => {
      const key = drawing.key ?? currentDrawing.key;
      drawingsRef.current[key] = null;
      currentDrawingRef.current = null;
      setCurrentDrawing(null);
      renderer.destroy(key);
      callOnDrawings();
    },
    [currentDrawing],
  );

  useEffect(() => {
    // deselect on tool change
    if (config.tool !== 'crosshair' && getCurrentDrawing()) {
      selectDrawing(null, null);
    }
  }, [config.tool]);

  useEffect(() => {
    const drawingTool = [
      'line',
      'hline',
      'vline',
      'rect',
      'harea',
      'text',
    ].includes(config.tool);

    dispatch.on('scale.chartDrawings', () => {
      values(drawingsRef.current)
        .filter(Boolean)
        .forEach(drawing => renderer(renderDrawing, rescaleDrawing(drawing)));
    });

    dispatch.on('pointerdown.chartDrawings', event => {
      const drawing = getCurrentDrawing();
      if (drawingTool) {
        if (!drawing) {
          renderer(renderDrawing, addDrawing(event));
        } else {
          const updateProps = updateDrawing(event);
          if (updateProps) {
            renderer(renderDrawing, updateProps);
          }
        }
      } else {
        // handle select/deselect
        if (drawing) {
          renderer(renderDrawing, selectDrawing(null, null));
        }
        const node = getNode(event);
        if (node) {
          renderer(renderDrawing, selectDrawing(node, event));
        }
      }
    });

    dispatch.on('mousemove.chartDrawings', event => {
      if (event) {
        const drawing = getCurrentDrawing();
        if (drawing) {
          if (drawingTool) {
            const updateProps = updateDrawing(event);
            if (updateProps) {
              renderer(renderDrawing, updateProps);
              return;
            }
          } else if (movingDrawingRef.current) {
            renderer(renderDrawing, moveDrawing(event));
            return;
          }
        }

        // handle hovering
        if (hoveringDrawingRef.current !== null) {
          renderer(renderDrawing, hoverDrawing(null));
        }
        const node = getNode(event);
        if (node) {
          const hdrawing = hoverDrawing(node);
          renderer(renderDrawing, hdrawing);
          dispatch.call('hoverDrawing', null, hdrawing);
        } else {
          dispatch.call('hoverDrawing', null, null);
        }
      }
    });

    dispatch.on('pointerup.chartDrawings', event => {
      if (movingDrawingRef.current) {
        drawingsRef.current[movingDrawingRef.current.key].isMoving = false;
        movingDrawingRef.current = null;
        setIsMovingText(false);
      }
    });

    dispatch.on('removeDrawing', drawing => {
      removeDrawing(drawing);
    });

    dispatch.on('removeDrawings', () => {
      values(drawingsRef.current)
        .filter(Boolean)
        .forEach(drawing => {
          removeDrawing(drawing);
        });
    });
  }, [dispatch, config.tool, layerRef.current]);

  return (
    <Layer
      ref={layerRef}
      clipX={frame.mainChart.xStart}
      clipY={frame.mainChart.yStart}
      clipWidth={frame.mainChart.width}
      clipHeight={frame.mainChart.height}
    >
      {currentDrawing && (
        <DrawingToolbar
          currentDrawing={currentDrawing}
          onColorChange={color => {
            const updatedDrawing = updateAttr('color', color);
            renderer(renderDrawing, updatedDrawing);
          }}
          onTextSizeChange={textSize => {
            renderer(renderDrawing, updateAttr('textSize', textSize));
          }}
          onRemove={removeDrawing}
        />
      )}
      <TextArea
        currentDrawing={currentDrawing}
        textSizeMapping={textSizeMapping}
        isMovingText={isMovingText}
        onTextFocus={() => {
          movingDrawingRef.current = null;
        }}
        onTextChange={text => {
          renderer(renderDrawing, updateAttr('text', text));
        }}
      />
    </Layer>
  );
}
