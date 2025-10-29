import React, { useState } from 'react';
import Konva from 'konva';
import { Layer, Group, Rect } from './konva';
import useContext from '../modules/useContext';
import Text from './Text';
import AngleDown from './AngleDown';
import HeaderToolbar from './HeaderToolbar';

function Header({ onTimeframeChange, onSymbolClick }) {
  const { frame, config, setCursor } = useContext();
  const [hoveringSymbol, setHoveringSymbol] = useState();

  const condensedMode = config.width < 472;

  const titleWidth = condensedMode
    ? new Konva.Text({
        text: config.symbol.code,
        fontFamily: config.theme.fontFamily,
        fontSize: config.theme.title.fontSize,
        fontStyle: 500,
      }).getTextWidth()
    : Math.max(
        new Konva.Text({
          text: config.symbol.name,
          fontFamily: config.theme.fontFamily,
          fontSize: config.theme.title.fontSize,
          fontStyle: 500,
        }).getTextWidth(),
        new Konva.Text({
          text: config.symbol.code,
          fontFamily: config.theme.fontFamily,
          fontSize: config.theme.subtitle.fontSize,
          fontStyle: 500,
        }).getTextWidth(),
      );

  return (
    <Layer>
      {config.symbolClick !== false ? (
        <Group
          onMouseEnter={() => {
            setCursor('pointer');
            setHoveringSymbol(true);
          }}
          onMouseLeave={() => {
            setCursor('default');
            setHoveringSymbol(false);
          }}
          onClick={onSymbolClick}
        >
          <Rect
            x={frame.header.xStart}
            y={frame.header.yStart}
            width={titleWidth + 8 + config.theme.header.angleDownSize + 4}
            height={
              4 +
              config.theme.title.fontSize +
              4 +
              config.theme.subtitle.fontSize +
              4
            }
          />
          <Text
            text={condensedMode ? config.symbol.code : config.symbol.name}
            x={frame.header.xStart}
            y={
              condensedMode ? frame.header.yStart + 12 : frame.header.yStart + 4
            }
            fontSize={config.theme.title.fontSize}
            fill={
              hoveringSymbol
                ? config.theme.title.colorHover
                : config.theme.title.color
            }
          />
          {!condensedMode && (
            <Text
              text={config.symbol.code}
              x={frame.header.xStart}
              y={frame.header.yStart + 4 + config.theme.title.fontSize + 4}
              fontSize={config.theme.subtitle.fontSize}
              fill={
                hoveringSymbol
                  ? config.theme.subtitle.colorHover
                  : config.theme.subtitle.color
              }
            />
          )}
          <AngleDown
            x={frame.header.xStart + titleWidth + (condensedMode ? 4 : 8)}
            y={
              condensedMode
                ? frame.header.yStart + 12 + 4
                : frame.header.yStart + 4 + 4
            }
            size={config.theme.header.angleDownSize}
            color={
              hoveringSymbol
                ? config.theme.header.angleDownColorHover
                : config.theme.header.angleDownColor
            }
          />
        </Group>
      ) : (
        <Group>
          <Text
            text={condensedMode ? config.symbol.code : config.symbol.name}
            x={frame.header.xStart}
            y={
              condensedMode ? frame.header.yStart + 12 : frame.header.yStart + 4
            }
            fontSize={config.theme.title.fontSize}
            fill={config.theme.title.color}
          />
          {!condensedMode && (
            <Text
              text={config.symbol.code}
              x={frame.header.xStart}
              y={frame.header.yStart + 4 + config.theme.title.fontSize + 4}
              fontSize={config.theme.subtitle.fontSize}
              fill={config.theme.subtitle.color}
            />
          )}
        </Group>
      )}
      <HeaderToolbar onTimeframeChange={onTimeframeChange} />
      {/* <Toolbar
        x={
          frame.header.xStart +
          titleWidth +
          8 +
          config.theme.header.angleDownSize +
          4
        }
        y={frame.header.yStart}
        availableWidth={
          width -
          titleWidth +
          8 +
          config.theme.header.angleDownSize +
          4 -
          settingsButtonWidth
        }
      /> */}
    </Layer>
  );
}

export default Header;
