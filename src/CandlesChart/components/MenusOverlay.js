import React, { useEffect, useState } from 'react';
import { Html } from 'react-konva-utils';
import { ThemeProvider } from 'styled-components';
import uiSystem from '../modules/uiSystem';
import useContext from '../modules/useContext';
import { Layer } from './konva';
import MenuItem from './react/MenuItem';
import Popover from './react/Popover';
import Separator from './react/Separator';

function Menu() {
  const { config, dispatch } = useContext();
  const [show, setShow] = useState(null);
  const [hoverDrawing, sethoverDrawing] = useState(null);

  useEffect(() => {
    dispatch.on('contextmenu.menusOverlay', event => {
      setShow({
        x: event.offsetX,
        y: event.offsetY,
      });
    });

    // outside click
    dispatch.on('pointerdown.menusOverlay', () => {
      setShow(null);
    });

    dispatch.on('hoverDrawing.menusOverlay', drawing => {
      sethoverDrawing(drawing);
    });
  }, [dispatch]);

  return (
    <Layer>
      {show && (
        <Html
          divProps={{
            style: { width: '100%' },
            className: 'streamlined-chart-html',
          }}
        >
          <ThemeProvider theme={uiSystem.theme}>
            <Popover
              onOutsideClick={() => setShow(null)}
              $top={show.y}
              $left={show.x}
              $py={0.75}
              $w={256}
              $color={config.theme.popoverMenu.color}
              showAngle={false}
              $textAlign="left"
              $maxH={192}
              $height="auto"
              $overflowY="scroll"
            >
              <MenuItem
                onClick={() => {
                  dispatch.call('resetZoom');
                  dispatch.call('rerender');
                  setShow(null);
                }}
              >
                Reset Chart
              </MenuItem>
              <Separator $my={0.5} />
              <MenuItem
                disabled={!hoverDrawing}
                onClick={() => {
                  dispatch.call('removeDrawing', null, hoverDrawing);
                  setShow(null);
                }}
              >
                Remove Drawing
              </MenuItem>
              <MenuItem
                onClick={() => {
                  dispatch.call('removeDrawings');
                  setShow(null);
                }}
              >
                Remove Drawings
              </MenuItem>
            </Popover>
          </ThemeProvider>
        </Html>
      )}
    </Layer>
  );
}

export default Menu;
