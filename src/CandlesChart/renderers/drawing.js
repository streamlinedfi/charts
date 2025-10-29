import { transparentize } from 'polished';

function renderLine({ config, key, points, color, isHovering, isSelected }) {
  const isActive = !!isHovering || !!isSelected;

  return [
    {
      type: 'Line',
      attrs: {
        key,
        stroke: color,
        strokeWidth: config.theme.lineWidth,
        hitStrokeWidth: config.theme.lineWidth + 5,
        points,
        anchor: {
          points,
          selection: [0, 1, 2, 3],
        },
      },
    },
    {
      type: 'Circle',
      attrs: {
        x: points[0],
        y: points[1],
        radius: config.theme.lineCircleSize / 2,
        fill: config.theme.bgColor,
        stroke: color,
        strokeWidth: config.theme.lineWidth,
        visible: !!isActive,
        listening: false,
      },
    },
    {
      type: 'Circle',
      attrs: {
        x: points[2],
        y: points[3],
        radius: config.theme.lineCircleSize / 2,
        fill: config.theme.bgColor,
        stroke: color,
        strokeWidth: config.theme.lineWidth,
        visible: !!isActive,
        listening: false,
      },
    },
  ];
}

function renderHorizontalLine({
  frame,
  config,
  key,
  points,
  color,
  isHovering,
  isSelected,
}) {
  const isActive = !!isHovering || !!isSelected;

  return [
    {
      type: 'Line',
      attrs: {
        key,
        stroke: color,
        strokeWidth: config.theme.lineWidth,
        hitStrokeWidth: config.theme.lineWidth + 5,
        points: [
          frame.mainChart.xStart,
          points[1],
          frame.mainChart.xEnd,
          points[1],
        ],
        anchor: {
          points,
          selection: [0, 1],
        },
      },
    },
    {
      type: 'Circle',
      attrs: {
        x: points[0],
        y: points[1],
        radius: config.theme.lineCircleSize / 2,
        fill: config.theme.bgColor,
        stroke: color,
        strokeWidth: config.theme.lineWidth,
        visible: !!isActive,
        listening: false,
      },
    },
  ];
}

function renderVerticalLine({
  frame,
  config,
  key,
  points,
  color,
  isHovering,
  isSelected,
}) {
  const isActive = !!isHovering || !!isSelected;

  return [
    {
      type: 'Line',
      attrs: {
        key,
        stroke: color,
        strokeWidth: config.theme.lineWidth,
        points: [
          points[0],
          frame.mainChart.yStart,
          points[0],
          frame.mainChart.yEnd,
        ],
        anchor: {
          points,
          selection: [0, 1],
        },
      },
    },
    {
      type: 'Circle',
      attrs: {
        key,
        x: points[0],
        y: points[1],
        radius: config.theme.lineCircleSize / 2,
        fill: config.theme.bgColor,
        stroke: color,
        strokeWidth: config.theme.lineWidth,
        visible: !!isActive,
        listening: false,
      },
    },
  ];
}

function renderRectangle({
  frame,
  config,
  key,
  points,
  color,
  isHovering,
  isSelected,
}) {
  const isActive = !!isHovering || !!isSelected;

  return [
    {
      type: 'Rect',
      attrs: {
        x: Math.min(points[0], points[2]),
        y: Math.min(points[1], points[3]),
        width: Math.abs(points[2] - points[0]),
        height: Math.abs(points[3] - points[1]),
        fill: transparentize(0.85, color),
        listening: false,
      },
    },
    {
      type: 'Line',
      attrs: {
        key,
        stroke: color,
        strokeWidth: 1,
        hitStrokeWidth: config.theme.lineWidth + 5,
        points: [
          [points[0], points[1]],
          [points[2], points[1]],
          [points[2], points[3]],
          [points[0], points[3]],
          [points[0], points[1]],
        ].flat(1),
        anchor: {
          points,
          selection: [0, 1, 2, 3],
        },
      },
    },
    {
      type: 'Circle',
      attrs: {
        x: points[0],
        y: points[1],
        radius: config.theme.lineCircleSize / 2,
        fill: config.theme.bgColor,
        stroke: color,
        strokeWidth: config.theme.lineWidth,
        visible: !!isActive,
        listening: false,
      },
    },
    {
      type: 'Circle',
      attrs: {
        x: points[2],
        y: points[3],
        radius: config.theme.lineCircleSize / 2,
        fill: config.theme.bgColor,
        stroke: color,
        strokeWidth: config.theme.lineWidth,
        visible: !!isActive,
        listening: false,
      },
    },
  ];
}

function renderHorizontalArea({
  frame,
  config,
  key,
  points,
  color,
  isHovering,
  isSelected,
}) {
  const isActive = !!isHovering || !!isSelected;

  return [
    {
      type: 'Rect',
      attrs: {
        x: frame.mainChart.xStart,
        y: points[1],
        width: frame.mainChart.width,
        height: points[3] - points[1],
        fill: transparentize(0.85, color),
        listening: false,
      },
    },
    {
      type: 'Line',
      attrs: {
        key,
        stroke: color,
        strokeWidth: 1,
        hitStrokeWidth: config.theme.lineWidth + 5,
        points: [
          frame.mainChart.xStart,
          points[1],
          frame.mainChart.xEnd,
          points[1],
        ],
        anchor: {
          points,
          selection: [0, 1],
        },
      },
    },
    {
      type: 'Circle',
      attrs: {
        x: points[0],
        y: points[1],
        radius: config.theme.lineCircleSize / 2,
        fill: config.theme.bgColor,
        stroke: color,
        strokeWidth: config.theme.lineWidth,
        visible: !!isActive,
        listening: false,
      },
    },
    {
      type: 'Line',
      attrs: {
        key,
        stroke: color,
        strokeWidth: 1,
        dash: [3, 4],
        points: [
          frame.mainChart.xStart,
          points[1] + (points[3] - points[1]) / 2, // Calculate middle Y position
          frame.mainChart.xEnd,
          points[1] + (points[3] - points[1]) / 2,
        ],
        listening: false,
      },
    },
    {
      type: 'Line',
      attrs: {
        key,
        stroke: color,
        strokeWidth: 1,
        hitStrokeWidth: config.theme.lineWidth + 5,
        points: [
          frame.mainChart.xStart,
          points[3],
          frame.mainChart.xEnd,
          points[3],
        ],
        anchor: {
          points,
          selection: [2, 3],
        },
      },
    },
    {
      type: 'Circle',
      attrs: {
        x: points[2],
        y: points[3],
        radius: config.theme.lineCircleSize / 2,
        fill: config.theme.bgColor,
        stroke: color,
        strokeWidth: config.theme.lineWidth,
        visible: !!isActive,
        listening: false,
      },
    },
  ];
}

export const textSizeMapping = {
  small: 12,
  medium: 15,
  large: 22,
};
function renderText({
  frame,
  config,
  key,
  points,
  color,
  text,
  textSize,
  isHovering,
  isSelected,
  isMoving,
}) {
  const isActive = !!isHovering || !!isSelected;

  return [
    {
      type: 'Text',
      attrs: {
        key,
        text,
        x: Math.min(points[0], points[2]) + 4,
        y: Math.min(points[1], points[3]) + 4,
        width: Math.abs(points[2] - points[0]) - 8,
        height: Math.abs(points[3] - points[1]) - 8,
        fontFamily: config.theme.fontFamily,
        fontStyle: config.theme.fontStyle,
        fontSize: textSizeMapping[textSize],
        lineHeight: 1.4,
        textDecoration: isHovering && !isSelected ? 'underline' : 'none',
        fill: color,
        points: [
          [points[0], points[1]],
          [points[2], points[1]],
          [points[2], points[3]],
          [points[0], points[3]],
          [points[0], points[1]],
        ].flat(1),
        anchor: {
          points,
          selection: [0, 1, 2, 3],
        },
        visible: !isSelected || isMoving,
      },
    },
    {
      type: 'Line',
      attrs: {
        key,
        text: true,
        stroke: config.theme.lineColor,
        strokeWidth: 1,
        hitStrokeWidth: config.theme.lineWidth + 5,
        points: [
          [points[0], points[1]],
          [points[2], points[1]],
          [points[2], points[3]],
          [points[0], points[3]],
          [points[0], points[1]],
        ].flat(1),
        opacity: isActive ? 1 : 0,
        anchor: {
          points,
          selection: [0, 1, 2, 3],
        },
      },
    },
    {
      type: 'Circle',
      attrs: {
        x: points[0],
        y: points[1],
        radius: config.theme.lineCircleSize / 2,
        fill: config.theme.bgColor,
        stroke: config.theme.lineColor,
        strokeWidth: config.theme.lineWidth,
        visible: !!isActive,
        listening: false,
      },
    },
    {
      type: 'Circle',
      attrs: {
        x: points[2],
        y: points[3],
        radius: config.theme.lineCircleSize / 2,
        fill: config.theme.bgColor,
        stroke: config.theme.lineColor,
        strokeWidth: config.theme.lineWidth,
        visible: !!isActive,
        listening: false,
      },
    },
  ];
}

const renderMapping = {
  line: renderLine,
  hline: renderHorizontalLine,
  vline: renderVerticalLine,
  rect: renderRectangle,
  harea: renderHorizontalArea,
  text: renderText,
};
export default function renderDrawing(props) {
  if (!props.points) {
    return null;
  }

  return renderMapping[props.type](props);
}
