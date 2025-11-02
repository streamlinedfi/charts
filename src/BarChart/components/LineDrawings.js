import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Group, Circle, Line } from './konva';
import useContext from '../modules/useContext';

const { keys, values, fromEntries, entries } = Object;

const id = 'linedrawings';

function LineDrawing({
  line,
  selectedLine,
  setSelectedLine,
  setMovingLine,
  mousePos,
}) {
  const { frame, config, setCursor } = useContext();
  const [isHovering, setIsHovering] = useState(false);

  let points = [];
  if (line.type === 'line') {
    points = line.points[2]
      ? line.points
      : [line.points[0], line.points[1], mousePos.x, mousePos.y];
  }

  if (line.type === 'vline') {
    points = [
      line.points[0],
      frame.innerChart.yStart,
      line.points[0],
      frame.innerChart.yEnd,
    ];
  }

  if (line.type === 'hline') {
    points = [
      frame.innerChart.xStart,
      line.points[1],
      frame.innerChart.xEnd,
      line.points[1],
    ];
  }

  return (
    <Group
      onMouseEnter={() => {
        setCursor('grab');
        setIsHovering(true);
      }}
      onMouseLeave={() => {
        setCursor('default');
        setIsHovering(false);
      }}
      onClick={() => {
        setSelectedLine(line.id);
      }}
    >
      {(line.type !== 'line' || line.points[2]) && (
        <Line
          stroke="transparent"
          strokeWidth={config.theme.lineCircleSize}
          points={points}
          onMouseDown={() => {
            setMovingLine([line.id, 'both']);
          }}
        />
      )}
      <Line
        stroke={line.stroke}
        strokeWidth={line.strokeWidth}
        points={points}
      />
      {(selectedLine === line.id || isHovering) && (
        <>
          <Circle
            x={line.points[0]}
            y={line.points[1]}
            radius={config.theme.lineCircleSize / 2}
            fill={config.theme.bgColor}
            stroke={line.stroke}
            strokeWidth={line.strokeWidth}
            onMouseDown={() => {
              setMovingLine([line.id, 0]);
            }}
          />
          {line.type === 'line' && line.points[2] && (
            <Circle
              x={line.points[2]}
              y={line.points[3]}
              radius={config.theme.lineCircleSize / 2}
              fill={config.theme.bgColor}
              stroke={line.stroke}
              strokeWidth={line.strokeWidth}
              onMouseDown={() => {
                setMovingLine([line.id, 1]);
              }}
            />
          )}
        </>
      )}
    </Group>
  );
}

function LineDrawings() {
  const {
    tool,
    setTool,
    config,
    setCursor,
    on,
    off,
    menuItems,
    setMenuItems,
  } = useContext();
  const mouseDeltaRef = useRef();
  const [mousePos, setMousePos] = useState({});
  const [lines, setLines] = useState({});
  const [selectedLine, setSelectedLine] = useState(null);
  const [movingLine, setMovingLine] = useState(null);
  const eventsActive = ['line', 'hline', 'vline'].includes(tool);

  const addLine = useCallback(
    (x, y) => {
      const lastLineId = keys(lines)
        .sort()
        .reverse()[0];
      const lastLine = lines[lastLineId];

      if (!lastLine || lastLine.type !== 'line' || lastLine.points[2]) {
        const lineId = Date.now();
        setLines({
          ...lines,
          [lineId]: {
            id: lineId,
            type: tool,
            stroke: config.theme.lineColor,
            strokeWidth: config.theme.lineWidth,
            points: [x, y],
          },
        });
        setSelectedLine(lineId);
        if (tool !== 'line') {
          setTool('crosshair');
        }
      } else {
        setLines({
          ...lines,
          [lastLine.id]: {
            ...lastLine,
            stroke: config.theme.lineColor,
            strokeWidth: config.theme.lineWidth,
            points: [...lastLine.points, x, y],
          },
        });
        setTool('crosshair');
      }
    },
    [lines, tool],
  );

  const moveLine = useCallback(
    (x, y) => {
      const [lineId, point] = movingLine;
      const line = lines[lineId];
      let points = [x, y];

      if (line.type === 'line') {
        if (point === 'both') {
          const deltaRef = mouseDeltaRef.current;
          if (!deltaRef.points) {
            deltaRef.points = line.points;
          }

          points = [
            deltaRef.points[0] + x - deltaRef.x,
            deltaRef.points[1] + y - deltaRef.y,
            deltaRef.points[2] + x - deltaRef.x,
            deltaRef.points[3] + y - deltaRef.y,
          ];
        } else if (point === 0) {
          points = [x, y, line.points[2], line.points[3]];
        } else if (point === 1) {
          points = [line.points[0], line.points[1], x, y];
        }
      }

      setLines({
        ...lines,
        [line.id]: {
          ...line,
          points,
        },
      });
    },
    [lines, movingLine],
  );

  useEffect(() => {
    on(
      'mousemove',
      ({ inInnerChartRange, evt }) => {
        if (inInnerChartRange) {
          const x = evt.offsetX;
          const y = evt.offsetY;
          setMousePos({ x, y });
          if (movingLine) {
            moveLine(x, y);
          }
        }
      },
      id,
    );

    return () => {
      off('mousemove', id);
    };
  }, [movingLine, moveLine]);

  useEffect(() => {
    on(
      'mousedown',
      ({ evt }) => {
        mouseDeltaRef.current = { x: evt.offsetX, y: evt.offsetY };
      },
      id,
    );

    return () => {
      off('mousedown', id);
    };
  }, []);

  useEffect(() => {
    on(
      'mouseup',
      () => {
        mouseDeltaRef.current = {};
        setMovingLine(null);
      },
      id,
    );

    return () => {
      off('mouseup', id);
    };
  }, []);

  useEffect(() => {
    on(
      'innerChartClick',
      ({ evt }) => {
        setSelectedLine(null);
        if (eventsActive) {
          addLine(evt.offsetX, evt.offsetY);
        }
      },
      id,
    );

    return () => {
      off('innerChartClick', id);
    };
  }, [addLine, eventsActive]);

  useEffect(() => {
    const removePendingLine = event => {
      if (['Escape', 'Backspace', 'Delete'].includes(event.key)) {
        const pendingLine = values(lines).find(
          line => line.type === 'line' && !line.points[2],
        );
        if (pendingLine) {
          setLines(
            fromEntries(
              entries(lines).filter(([lineId]) => lineId !== pendingLine.id),
            ),
          );
        }
      }
    };

    document.addEventListener('keydown', removePendingLine);

    return () => {
      document.removeEventListener('keydown', removePendingLine);
    };
  }, [lines]);

  useEffect(() => {
    if (movingLine) {
      setCursor('grabbing');
    }
  }, [movingLine]);

  useEffect(() => {
    if (keys(lines).length) {
      setMenuItems({
        ...menuItems,
        removeSelected:
          selectedLine !== null
            ? {
                text: 'Remove Drawing',
                onClick: () => {
                  setLines(
                    fromEntries(
                      entries(lines).filter(
                        ([lineId]) => lineId !== selectedLine,
                      ),
                    ),
                  );
                },
              }
            : null,
        removeAll: {
          text: 'Remove All Drawings',
          onClick: () => setLines([]),
        },
      });
    } else {
      setMenuItems({
        ...menuItems,
        removeSelected: null,
        removeAll: null,
      });
    }
  }, [JSON.stringify(menuItems), JSON.stringify(lines), selectedLine]);

  return values(lines).map(line => (
    <LineDrawing
      key={line.i}
      line={line}
      selectedLine={selectedLine}
      setSelectedLine={setSelectedLine}
      setMovingLine={setMovingLine}
      mousePos={mousePos}
    />
  ));
}

export default LineDrawings;
