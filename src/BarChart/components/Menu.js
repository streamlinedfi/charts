import React, { useState, useEffect } from 'react';
import { Group, Rect } from './konva';
import useContext from '../modules/useContext';
import Text from './Text';

const id = 'menu';

function MenuItem({ x, y, children, onClick }) {
  const { config, setCursor } = useContext();
  const [isHover, setIsHover] = useState(false);

  return (
    <Group
      onMouseEnter={() => {
        setIsHover(true);
        setCursor('pointer');
      }}
      onMouseLeave={() => {
        setIsHover(false);
        setCursor('default');
      }}
      onClick={onClick}
    >
      <Rect
        x={x}
        y={y}
        width={180 - 4 - 4}
        height={
          config.theme.menu.item.fontSize + config.theme.menu.item.padding * 2
        }
        fill={isHover ? config.theme.menu.item.bgColorHover : 'transparent'}
        cornerRadius={config.theme.menu.item.borderRadius}
      />
      <Text
        text={children}
        x={x + config.theme.menu.item.padding}
        y={y + config.theme.menu.item.padding}
        fontSize={config.theme.menu.item.fontSize}
        fill={
          isHover
            ? config.theme.menu.item.colorHover
            : config.theme.menu.item.color
        }
      />
    </Group>
  );
}

function Menu() {
  const { config, on, off, menuItems } = useContext();
  const [pos, setPos] = useState();
  const [show, setShow] = useState(false);

  const itemHeight =
    config.theme.menu.item.fontSize + config.theme.menu.item.padding * 2;
  const items = Object.values(menuItems).filter(Boolean);

  const width = 180;

  useEffect(() => {
    on(
      'click',
      e => {
        // left click
        if (show && e.evt.which === 1) {
          setShow(false);
        }

        // right click
        if (e.inInnerChartRange && e.evt.which === 3 && items.length) {
          setShow(true);
          setPos({ x: e.evt.offsetX, y: e.evt.offsetY });
        }
      },
      id,
    );

    return () => {
      off('click', id);
    };
  }, [show, pos, items.length]);

  if (!show || !pos) {
    return null;
  }

  const { x, y } = pos;

  return (
    <>
      <Rect
        x={x}
        y={y}
        width={width}
        height={config.theme.menu.padding * 2 + itemHeight * items.length}
        stroke={config.theme.menu.borderColor}
        strokeWidth={config.theme.menu.borderWidth}
        fill={config.theme.menu.bgColor}
        cornerRadius={config.theme.menu.borderRadius}
      />
      {items.map((menuItem, i) => (
        <MenuItem
          height={itemHeight}
          x={x + config.theme.menu.padding}
          y={y + config.theme.menu.padding + itemHeight * i}
          onClick={menuItem.onClick}
        >
          {menuItem.text}
        </MenuItem>
      ))}
    </>
  );
}

export default Menu;
