import { Div, Text } from '@streamlinedfi/div';
import React from 'react';
import useContext from '../../modules/useContext';
import MenuItem from './MenuItem';
import Popover from './Popover';
import Separator from './Separator';

/**
 * items: [{
 *   type: 'Item' | 'Separator' | 'Title',
 *   props: {
 *     text: String,
 *     href: String
 *   }
 * }]
 */

export default function PopoverMenu({
  show,
  setShow,
  items,
  children,
  x = 'left',
  y = 'bottom',
  xOffset = 0,
  yOffset = 0,
  showAngle = false,
  ...props
}) {
  const { config } = useContext();

  return (
    <Popover
      $display={show ? 'block' : 'none'}
      y={y}
      x={x}
      xOffset={xOffset}
      yOffset={yOffset}
      onOutsideClick={() => setShow(false)}
      $py={0.75}
      $color={config.theme.popoverMenu.color}
      showAngle={showAngle}
      $textAlign="left"
      {...props}
    >
      {items.map((item, i) => {
        if (/title/i.test(item.type)) {
          return (
            <Div
              key={item.key || item.props.text || i}
              $py={0.375}
              $px={1.25}
              $mx={0.5}
            >
              <Text
                $size={12}
                $weight={600}
                $color={config.theme.popoverMenu.uppercaseColor}
                $uppercase
              >
                {item.props.text}
              </Text>
            </Div>
          );
        }

        if (/item/i.test(item.type)) {
          if (item.props.href || item.href) {
            return (
              <MenuItem
                as="a"
                prefetch={false}
                key={item.key || item.props.text || i}
                href={item.props.href || item.href}
                {...item.props}
                onClick={e => {
                  setShow(false);
                  if (item.props.onClick) {
                    item.props.onClick(e);
                  }
                }}
              >
                {item.props.text}
              </MenuItem>
            );
          }
          return (
            <MenuItem
              key={item.key || item.props.text || i}
              href={item.props.href}
              {...item.props}
              onClick={e => {
                setShow(false);
                if (item.props.onClick) {
                  item.props.onClick(e);
                }
              }}
            >
              {item.props.text}
            </MenuItem>
          );
        }

        if (/separator/i.test(item.type)) {
          return <Separator key={i} $my={0.5} />;
        }
      })}
    </Popover>
  );
}
