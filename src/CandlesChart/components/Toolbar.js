import Konva from 'konva';
import React, { useState } from 'react';
import useImage from 'use-image';
import useContext from '../modules/useContext';
import { Group, Image, Rect } from './konva';
import Text from './Text';
// import Rectangle from '../assets/rectangle.svg';

const timeframeButtons = [
  {
    text: '1m',
    active: false,
    onClick: () => {},
  },
  {
    text: '5m',
    active: false,
    onClick: () => {},
  },
  {
    text: '10m',
    active: false,
    onClick: () => {},
  },
  {
    text: '30m',
    active: false,
    onClick: () => {},
  },
  {
    text: '1h',
    active: false,
    onClick: () => {},
  },
  {
    text: '4h',
    active: false,
    onClick: () => {},
  },
  {
    text: '1d',
    active: true,
    onClick: () => {},
  },
];

const cursorButtons = [
  {
    image: '/chart/assets/crosshair.svg',
    imageHover: '/chart/assets/crosshair-highlighted.svg',
    imageMarginTop: 0,
    imageMarginLeft: 0,
    tool: 'crosshair',
  },
  {
    image: '/chart/assets/line.svg',
    imageHover: '/chart/assets/line-highlighted.svg',
    tool: 'line',
  },
  {
    image: '/chart/assets/rectangle.svg',
    imageHover: '/chart/assets/rectangle-highlighted.svg',
    imageMarginTop: 2,
    imageMarginLeft: 1,
    tool: 'rect',
  },
  {
    image: '/chart/assets/harea.svg',
    imageHover: '/chart/assets/harea-highlighted.svg',
    imageMarginTop: 3,
    tool: 'harea',
  },
  {
    image: '/chart/assets/hline.svg',
    imageHover: '/chart/assets/hline-highlighted.svg',
    imageMarginTop: 5,
    tool: 'hline',
  },
  {
    image: '/chart/assets/vline.svg',
    imageHover: '/chart/assets/vline-highlighted.svg',
    tool: 'vline',
    imageMarginLeft: 4.5,
  },
  {
    image: '/chart/assets/text.svg',
    imageHover: '/chart/assets/text-highlighted.svg',
    imageMarginTop: 2,
    imageMarginLeft: 3,
    tool: 'text',
  },
];

function Button({
  x,
  y,
  width = 32,
  text,
  fontSize,
  active,
  image,
  imageHover,
  imageMarginTop = 0,
  imageMarginLeft = 0,
  onClick,
}) {
  const { config, setCursor } = useContext();
  const [hovering, setHovering] = useState();

  const [img] = useImage(image);
  const [imgHover] = useImage(imageHover);

  const textWidth =
    text &&
    new Konva.Text({
      text,
      fontFamily: config.theme.fontFamily,
      fontSize: fontSize || config.theme.header.buttonFontSize,
      fontWeight: 500,
    }).getTextWidth();

  return (
    <>
      <Group
        onMouseEnter={() => {
          setCursor('pointer');
          setHovering(true);
        }}
        onMouseLeave={() => {
          setCursor('default');
          setHovering(false);
        }}
        onMouseDown={onClick}
      >
        <Rect
          x={x}
          y={y}
          width={width}
          height={32}
          cornerRadius={16}
          fill={active ? config.theme.header.buttonBgColorActive : undefined}
        />
        {text ? (
          <Text
            text={text}
            x={x + (width - textWidth) / 2}
            y={y + 12}
            fontSize={fontSize || config.theme.header.buttonFontSize}
            fill={
              hovering || active
                ? config.theme.header.buttonColorHover
                : config.theme.header.buttonColor
            }
          />
        ) : (
          <Image
            x={x + (width - 16) / 2 + imageMarginLeft}
            y={y + 9 + imageMarginTop}
            image={hovering || active ? imgHover : img}
            // width={16}
            // height={16}
          />
        )}
      </Group>
    </>
  );
}

function ButtonsSection({ x, y, buttons }) {
  const { config } = useContext();

  return (
    <>
      <Rect
        x={x}
        y={y}
        width={2 + buttons.length * 32}
        height={34}
        cornerRadius={17}
        strokeWidth={1}
        stroke={config.theme.header.toolbarBorderColor}
      />
      {buttons.map((props, i) => (
        <Button y={y + 1} x={x + 1 + 32 * i} {...props} />
      ))}
    </>
  );
}

export default function Toolbar(props) {
  const { x, y, availableWidth } = props;
  const { config, setConfig } = useContext();

  const xStart = x + 220;

  return (
    <>
      <ButtonsSection y={y} x={xStart} buttons={timeframeButtons} />
      {/* <Rect
        x={xStart + 2 + timeframeButtons.length * 32 + 12}
        y={y}
        width={2 + 46}
        height={34}
        cornerRadius={17}
        strokeWidth={1}
        stroke={config.theme.header.toolbarBorderColor}
      /> */}
      {/* <Button
        y={y + 1}
        x={xStart + 2 + timeframeButtons.length * 32 + 12 + 1}
        width={46}
        text="SNAP"
        fontSize={11}
        active={config.snap}
        onClick={() => {
          setConfig({
            ...config,
            snap: !config.snap,
          });
        }}
      /> */}
      <ButtonsSection
        y={y}
        x={xStart + 2 + timeframeButtons.length * 32 + 12}
        buttons={cursorButtons.map(props => ({
          ...props,
          active: config.tool === props.tool,
          onClick: () =>
            setConfig({
              ...config,
              tool: props.tool,
            }),
        }))}
      />
      <Rect
        x={
          xStart +
          2 +
          timeframeButtons.length * 32 +
          12 +
          2 +
          cursorButtons.length * 32 +
          12
        }
        y={y}
        width={2 + 84}
        height={34}
        cornerRadius={17}
        strokeWidth={1}
        stroke={config.theme.header.toolbarBorderColor}
      />
      <Button
        y={y + 1}
        x={
          xStart +
          2 +
          timeframeButtons.length * 32 +
          12 +
          2 +
          cursorButtons.length * 32 +
          12 +
          1
        }
        width={84}
        text="Indicators"
      />
    </>
  );
  // return (
  //   <>
  //     <Line
  //       stroke={color}
  //       strokeWidth={1.5}
  //       points={[x, y, x + size / 2, y + size / 2]}
  //     />
  //     <Line
  //       stroke={color}
  //       strokeWidth={1.5}
  //       points={[x + size / 2, y + size / 2, x + size, y]}
  //     />
  //   </>
  // );
}
