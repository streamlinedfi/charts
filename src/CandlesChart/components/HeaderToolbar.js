import { useFloating } from '@floating-ui/react-dom';
import { Div, Text } from '@streamlinedfi/div';
import { Fullscreen } from '@styled-icons/boxicons-regular/Fullscreen';
import { AngleDown } from '@styled-icons/fa-solid/AngleDown';
import { transparentize } from 'polished';
import React, { useState } from 'react';
import { Html } from 'react-konva-utils';
import { ThemeProvider } from 'styled-components';
import Crosshair from '../assets/crosshair.svg';
import HArea from '../assets/harea.svg';
import HLine from '../assets/hline.svg';
import Line from '../assets/line.svg';
import Rect from '../assets/rect.svg';
import TextIcon from '../assets/text.svg';
import VLine from '../assets/vline.svg';
import uiSystem from '../modules/uiSystem';
import useContext from '../modules/useContext';
import useScreenshot from '../modules/useScreenshot';
import IndicatorsMenu from './IndicatorsMenu';
import Button from './react/Button';
import Popover from './react/Popover';

const { entries } = Object;

const tools = {
  crosshair: Crosshair,
  line: Line,
  rect: Rect,
  harea: HArea,
  hline: HLine,
  vline: VLine,
  text: TextIcon,
};

export default function HeaderToolbar({ onTimeframeChange }) {
  const context = useContext();
  const { frame, config, setConfig } = context;
  const [showTimeframes, setShowTimeframes] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const downloadScreenshot = useScreenshot();
  const currentTimeframe = config.timeframe;

  const isMobile =
    typeof window !== 'undefined' && typeof document !== 'undefined'
      ? document.body.clientWidth < config.mobileThreshold
      : false;
  const condensedMode = config.width < 472;

  const { x, y, reference, floating, strategy } = useFloating({
    strategy: 'absolute',
    placement: 'bottom',
  });

  const setTool = tool =>
    setConfig({
      ...config,
      tool,
    });

  const setShowIndicatorsMenu = (showMenu = true) => {
    setConfig({
      ...config,
      indicators: {
        ...config.indicators,
        showMenu,
        currentScreen: 'Indicators',
      },
    });
  };

  const breakpoint = 976;
  const CurrentToolIcon = tools[config.tool];

  return (
    <Html
      divProps={{
        style: { width: '100%' },
        className: 'streamlined-chart-html',
      }}
    >
      <ThemeProvider theme={uiSystem.theme}>
        <Div $w="100%" $absolute>
          <Div
            $flex
            $w="auto"
            $absolute
            $top={frame.header.yStart}
            {...(config.width > breakpoint
              ? {
                  $left: '50%',
                  $transform: 'translateX(-50%)',
                }
              : {
                  $right: config.theme.header.marginRight,
                })}
          >
            <Div
              $relative
              $flex
              $innerCenter
              $w="auto"
              $border={
                showTimeframes
                  ? `1px solid ${config.theme.header.buttonBorderColorActive}`
                  : `1px solid ${config.theme.header.buttonBorderColor}`
              }
              $background={config.theme.header.background}
              $h={34}
              $radius={17}
              $mr={0.5}
            >
              {config.width > breakpoint ? (
                config.timeframes.map(tf => (
                  <Div
                    key={tf.id}
                    $flex
                    as="button"
                    $shrink="0"
                    $innerCenter
                    $w={32}
                    $h={32}
                    $radius={16}
                    $fontSize={13}
                    $fontWeight={config.theme.fontWeight}
                    $color={
                      currentTimeframe.id === tf.id
                        ? config.theme.header.buttonColorActive
                        : config.theme.header.buttonColor
                    }
                    $background={
                      currentTimeframe.id === tf.id
                        ? config.theme.header.buttonBgColorActive
                        : 'none'
                    }
                    $border="0"
                    onClick={() => onTimeframeChange(tf)}
                  >
                    {tf.text}
                  </Div>
                ))
              ) : (
                <>
                  <Div
                    id="t"
                    $flex
                    as="button"
                    $shrink="0"
                    $innerCenter
                    $h={32}
                    $px={0.75}
                    $radius={16}
                    $fontSize={13}
                    $fontWeight={config.theme.fontWeight}
                    $color={
                      showTimeframes
                        ? config.theme.header.buttonColorActive
                        : config.theme.header.buttonColor
                    }
                    $boxShadow={`inset 0 0 0 1px ${
                      showTimeframes
                        ? transparentize(
                            0.5,
                            config.theme.header.buttonColorActive,
                          )
                        : 'transparent'
                    }`}
                    $background="none"
                    $border="0"
                    onClick={() => setShowTimeframes(!showTimeframes)}
                  >
                    <Div as="span" $mr={0.25}>
                      {currentTimeframe.text}
                    </Div>
                    <Div as={AngleDown} $w={12} />
                  </Div>
                  {showTimeframes && (
                    <Popover
                      x="center"
                      y="bottom"
                      onOutsideClick={() => setShowTimeframes(false)}
                      $p={1.25}
                      $color={config.theme.popoverMenu.color}
                      showAngle={false}
                      $textAlign="left"
                    >
                      {entries(config.timeframesMenu).map(([key, values]) => (
                        <div key={key}>
                          <Text
                            $size={13}
                            $weight={600}
                            $color={config.theme.popoverMenu.uppercaseColor}
                            $uppercase
                            $mt={0}
                            $mb={0.5}
                          >
                            {key}
                          </Text>
                          <Div $flex $mb={1.5}>
                            {values.map(tf => (
                              <Button
                                active={tf.id === currentTimeframe.id}
                                size="small"
                                rounded
                                key={tf.id}
                                $mr={0.5}
                                onClick={() => {
                                  onTimeframeChange(tf);
                                  setShowTimeframes(false);
                                }}
                              >
                                {tf.text}
                              </Button>
                            ))}
                          </Div>
                        </div>
                      ))}
                    </Popover>
                  )}
                </>
              )}
            </Div>

            {!isMobile && (
              <Div
                $relative
                $flex
                $innerCenter
                $w="auto"
                $border={
                  showTools
                    ? `1px solid ${config.theme.header.buttonBorderColorActive}`
                    : `1px solid ${config.theme.header.buttonBorderColor}`
                }
                $boxShadow={`inset 0 0 0 1px ${
                  showTools
                    ? transparentize(
                        0.5,
                        config.theme.header.buttonBorderColorActive,
                      )
                    : 'transparent'
                }`}
                $background={config.theme.header.background}
                $h={34}
                $radius={17}
                $mr={0.5}
              >
                {config.width > breakpoint ? (
                  entries(tools).map(([tool, Icon]) => (
                    <Div
                      key={tool}
                      $flex
                      as="button"
                      $shrink="0"
                      $innerCenter
                      $w={32}
                      $h={32}
                      $radius={16}
                      $color={
                        config.tool === tool
                          ? config.theme.header.buttonColorActive
                          : config.theme.header.buttonColor
                      }
                      $background={
                        config.tool === tool
                          ? config.theme.header.buttonBgColorActive
                          : 'none'
                      }
                      $border="0"
                      onClick={() => setTool(tool)}
                      aria-label={tool}
                    >
                      <Icon />
                    </Div>
                  ))
                ) : (
                  <>
                    <Div
                      $flex
                      as="button"
                      aria-label="Chart tool"
                      $shrink="0"
                      $innerCenter
                      $h={32}
                      $px={0.75}
                      $radius={16}
                      $color={
                        showTools
                          ? config.theme.header.buttonColorActive
                          : config.theme.header.buttonColor
                      }
                      $background="none"
                      $border="0"
                      onClick={() => setShowTools(!showTools)}
                    >
                      <Div as={CurrentToolIcon} $mr={0.25} />
                      <Div as={AngleDown} $w={12} />
                    </Div>
                    {showTools && (
                      <Popover
                        x="left"
                        y="bottom"
                        onOutsideClick={() => setShowTools(false)}
                        $p={1}
                        $color={config.theme.popoverMenu.color}
                        showAngle={false}
                        $textAlign="left"
                      >
                        <Text
                          $size={13}
                          $weight={600}
                          $color={config.theme.popoverMenu.uppercaseColor}
                          $uppercase
                          $mt={0}
                          $mb={0.5}
                          $center
                        >
                          Tools
                        </Text>
                        <Div $flex>
                          {entries(tools).map(([tool, Icon]) => (
                            <Button
                              key={tool}
                              active={tool === config.tool}
                              size="small"
                              rounded
                              $mx={0.25}
                              onClick={() => {
                                setTool(tool);
                                setShowTools(false);
                              }}
                            >
                              <Icon />
                            </Button>
                          ))}
                        </Div>
                      </Popover>
                    )}
                  </>
                )}
              </Div>
            )}
            {!condensedMode && (
              <Div
                ref={reference}
                as="button"
                $flex
                $innerCenter
                $w="auto"
                $border={`1px solid ${
                  config.indicators.showMenu
                    ? config.theme.header.buttonBorderColorActive
                    : config.theme.header.buttonBorderColor
                }`}
                $background={config.theme.header.background}
                $h={34}
                $radius={17}
                $px={0.75}
                $fontSize={13}
                $fontWeight={config.theme.fontWeight}
                $color={
                  config.indicators.showMenu
                    ? config.theme.header.buttonColorActive
                    : config.theme.header.buttonColor
                }
                $mr={0.5}
                onClick={() =>
                  setShowIndicatorsMenu(!config.indicators.showMenu)
                }
              >
                Indicators
              </Div>
            )}
            {config.indicators.showMenu && (
              <IndicatorsMenu
                floating={floating}
                strategy={strategy}
                x={x}
                y={y}
                context={context}
                onOutsideClick={() => setShowIndicatorsMenu(false)}
              />
            )}
            {config.width >= 584 && (
              <Div
                as="button"
                $flex
                $innerCenter
                $w="auto"
                $border={config.theme.header.buttonBorderColor}
                $background={config.theme.header.background}
                $h={34}
                $radius={17}
                $px={0.75}
                $fontSize={13}
                $fontWeight={config.theme.fontWeight}
                $color={config.theme.header.buttonColor}
                $mr={0.5}
                onClick={downloadScreenshot}
              >
                Screenshot
              </Div>
            )}
            {config.showFullscreenButton && (
              <Div
                as="button"
                $flex
                $innerCenter
                $w="auto"
                $border={config.theme.header.buttonBorderColor}
                $background={config.theme.header.background}
                $h={34}
                $radius={17}
                $px={0.75}
                $fontSize={13}
                $color={config.theme.header.buttonColor}
                onClick={() =>
                  setConfig({
                    ...config,
                    fullscreen: !config.fullscreen,
                  })
                }
              >
                <Div
                  as={Fullscreen}
                  $w={20}
                  $fill={config.theme.header.buttonColor}
                />
              </Div>
            )}
          </Div>
        </Div>
      </ThemeProvider>
    </Html>
  );
}
