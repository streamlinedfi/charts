import NextLink from 'next/link'
import React from 'react'
import Div from './Div'
import MenuItem from './MenuItem'
import Popover from './Popover'
import Separator from './Separator'
import Text from './Text'

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
  return (
    <Popover
      $display={show ? 'block' : 'none'}
      y={y}
      x={x}
      xOffset={xOffset}
      yOffset={yOffset}
      onOutsideClick={() => setShow(false)}
      $py={0.75}
      $color={(theme) => theme.fill700}
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
              $color$hover={(theme) => theme.fill900}
            >
              <Text $size={12} $weight={600} $color={500} $uppercase>
                {item.props.text}
              </Text>
            </Div>
          )
        }

        if (/item/i.test(item.type)) {
          if (item.props.href || item.href) {
            return (
              <MenuItem
                as={NextLink}
                prefetch={false}
                key={item.key || item.props.text || i}
                href={item.props.href || item.href}
                {...item.props}
                onClick={(e) => {
                  setShow(false)
                  if (item.props.onClick) {
                    item.props.onClick(e)
                  }
                }}
              >
                {item.props.text}
              </MenuItem>
            )
          }
          return (
            <MenuItem
              key={item.key || item.props.text || i}
              href={item.props.href}
              {...item.props}
              onClick={(e) => {
                setShow(false)
                if (item.props.onClick) {
                  item.props.onClick(e)
                }
              }}
            >
              {item.props.text}
            </MenuItem>
          )
        }

        if (/separator/i.test(item.type)) {
          return <Separator key={i} $my={0.5} />
        }
      })}
    </Popover>
  )
}
