import Div from '@streamlinedfi/div';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import OutsideClickHandler from 'react-outside-click-handler';
import { Breakpoints } from '../../../modules/shared/theme.esm';
import useSize from '../../modules/useSize';
import Close from './Close';

export default function Popover({
  children,
  x,
  xOffset = 0,
  y,
  yOffset = 0,
  onOutsideClick = () => {},
  hideCloseIcon,
  showAngle = true,
  $display = 'block',
  zIndex = 3,
  ...props
}) {
  const childrenRef = useRef();
  const [, vh] = useSize();
  const [, height] = useSize(childrenRef);

  // cant use redux here, because it's used in the chart where there’s no redux
  const [isMobile, setIsMobile] = useState();

  useEffect(() => {
    setIsMobile(Breakpoints.isMobile());
  }, []);

  const xMapping = {
    left: {
      $right: 0 + xOffset,
    },
    right: {
      $left: 0 + xOffset,
    },
    center: {
      $left: '50%',
      $transform: xOffset
        ? `translateX(calc(-50% + ${xOffset}px))`
        : 'translateX(-50%)',
    },
  };

  const yMapping = {
    top: {
      $bottom: `calc(100% + 4px + ${yOffset}px)`,
    },
    bottom: {
      $top: `calc(100% + 4px + ${yOffset}px)`,
    },
  };

  const xOuterArrowMapping = {
    left: {
      $right: '21px',
      $transform: 'rotate(45deg)',
    },
    center: {
      $left: '50%',
      $transform: 'translateX(-50%) rotate(45deg)',
    },
    right: {
      $left: '21px',
      $transform: 'rotate(45deg)',
    },
  };

  const xInnerArrowMapping = {
    left: {
      $right: '20px',
      $transform: 'rotate(45deg)',
    },
    center: {
      $left: '50%',
      $transform: 'translateX(-50%) rotate(45deg)',
    },
    right: {
      $left: '20px',
      $transform: 'rotate(45deg)',
    },
  };

  const yOuterArrowMapping = {
    top: {
      $bottom: -8,
    },
    bottom: {
      $top: -8,
    },
  };

  const yInnerArrowMapping = {
    top: {
      $bottom: -6,
    },
    bottom: {
      $top: -6,
    },
  };

  const content = (
    <OutsideClickHandler onOutsideClick={onOutsideClick}>
      {isMobile && ['block', 'flex'].includes($display) && (
        <Div
          $cover
          $fixed
          $z={theme => theme.zIndices.modal - 1}
          $background="rgba(0, 0, 0, 0.7)"
          onClick={onOutsideClick}
        />
      )}
      <Div
        $display={$display}
        $minW={256}
        $background={theme => theme.backgroundDarker}
        $border={theme => `1px solid ${theme.fill300}`}
        $mobile$borderBottom="none"
        $boxShadow="0 0 2px 1px rgba(0, 0, 0, .3)"
        onClick={e => e.stopPropagation()}
        {...props}
        {...(isMobile
          ? {
              $fixed: true,
              $z: theme => theme.zIndices.modal,
              $left: 8,
              $right: 8,
              $bottom: 0,
              $w: 'auto',
              $h: height ? `${Math.min(height + 24, vh / 2)}px` : 'auto',
              $radius: [10, 10, 0, 0],
            }
          : {
              $absolute: true,
              $z: zIndex,
              $radius: 10,
              ...xMapping[x],
              ...yMapping[y],
              ...(props.$left && { $left: props.$left }),
              ...(props.$top && { $top: props.$top }),
            })}
      >
        {isMobile && !hideCloseIcon && <Close onClick={onOutsideClick} />}
        {!isMobile && showAngle && (
          <>
            <Div
              $absolute
              $zIndex={2}
              $w={16}
              $h={16}
              $background={theme => theme.backgroundDarker}
              {...xInnerArrowMapping[x]}
              {...yInnerArrowMapping[y]}
            />
            <Div
              $absolute
              $zIndex={1}
              $w={14}
              $h={14}
              $background={theme => theme.fill300}
              $boxShadow="0 0 2px 1px rgba(0, 0, 0, .3)"
              {...xOuterArrowMapping[x]}
              {...yOuterArrowMapping[y]}
            />
          </>
        )}
        <Div
          ref={childrenRef}
          $display={$display}
          $h="auto"
          className="popover-inner"
        >
          {children}
        </Div>
      </Div>
    </OutsideClickHandler>
  );

  if (isMobile === undefined) {
    return null;
  }

  if (isMobile) {
    return createPortal(content, document.getElementById('modal-container'));
  }

  return content;
}
