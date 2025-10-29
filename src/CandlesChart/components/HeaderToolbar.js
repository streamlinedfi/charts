import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Html } from 'react-konva-utils';
import { transparentize } from 'polished';
import { ThemeProvider } from 'styled-components';
import { AngleDown } from '@styled-icons/fa-solid/AngleDown';
import { Fullscreen } from '@styled-icons/boxicons-regular/Fullscreen';
import { useFloating } from '@floating-ui/react-dom';
import useContext from '../modules/useContext';
import Div from '../../Div';
import Text from '../../Text';
import Popover from '../../Popover';
import Button from '../../Button';
import { Breakpoints } from '../../../modules/shared/theme';
import Crosshair from '../assets/crosshair.svg';
import Line from '../assets/line.svg';
import Rect from '../assets/rect.svg';
import HArea from '../assets/harea.svg';
import HLine from '../assets/hline.svg';
import VLine from '../assets/vline.svg';
import TextIcon from '../assets/text.svg';
import useScreenshot from '../modules/useScreenshot';
import IndicatorsMenu from './IndicatorsMenu';

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
  const { frame, config, setConfig, dispatch } = context;
  const [showTimeframes, setShowTimeframes] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const downloadScreenshot = useScreenshot();
  const theme = useSelector(state => state.ui.theme);
  const currentTimeframe = config.timeframe;

  const isMobile = Breakpoints.isMobile();
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
    <Html divProps={{ style: { width: '100%' } }}>
      <ThemeProvider theme={theme}>
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
                  ? `1px solid ${theme.primary}`
                  : `1px solid ${theme.fill300}`
              }
              $background={theme.backgroundDarker}
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
                    $color={
                      currentTimeframe.id === tf.id
                        ? theme.fill800
                        : theme.fill500
                    }
                    $background={
                      currentTimeframe.id === tf.id ? theme.fill100 : undefined
                    }
                    onClick={() => onTimeframeChange(tf)}
                  >
                    {tf.text}
                  </Div>
                ))
              ) : (
                <>
                  <Div
                    $flex
                    as="button"
                    $shrink="0"
                    $innerCenter
                    $h={32}
                    $px={0.75}
                    $radius={16}
                    $fontSize={13}
                    $color={showTimeframes ? theme.primary : theme.fill500}
                    $boxShadow={theme =>
                      `inset 0 0 0 1px ${
                        showTimeframes
                          ? transparentize(0.5, theme.primary)
                          : 'transparent'
                      }`
                    }
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
                      $color={theme => theme.fill700}
                      showAngle={false}
                      $textAlign="left"
                    >
                      <Text
                        $size={13}
                        $weight={600}
                        $color={500}
                        $uppercase
                        $mb={0.5}
                      >
                        Minute
                      </Text>
                      <Div $flex $mb={1.5}>
                        {config.timeframes
                          .filter(td => /^M/.test(td.id))
                          .map(tf => (
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
                      <Text
                        $size={13}
                        $weight={600}
                        $color={500}
                        $uppercase
                        $mb={0.5}
                      >
                        Hour
                      </Text>
                      <Div $flex $mb={1.5}>
                        {config.timeframes
                          .filter(td => /^H/.test(td.id))
                          .map(tf => (
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
                      <Text
                        $size={13}
                        $weight={600}
                        $color={500}
                        $uppercase
                        $mb={0.5}
                      >
                        Day/Week
                      </Text>
                      <Div $flex>
                        {config.timeframes
                          .filter(td => /^(D|W)/.test(td.id))
                          .map(tf => (
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
                    ? `1px solid ${theme.primary}`
                    : `1px solid ${theme.fill300}`
                }
                $boxShadow={theme =>
                  `inset 0 0 0 1px ${
                    showTools
                      ? transparentize(0.5, theme.primary)
                      : 'transparent'
                  }`
                }
                $background={theme.backgroundDarker}
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
                        config.tool === tool ? theme.fill800 : theme.fill500
                      }
                      $background={
                        config.tool === tool ? theme.fill100 : undefined
                      }
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
                      $color={showTools ? theme.primary : theme.fill500}
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
                        $color={theme => theme.fill700}
                        showAngle={false}
                        $textAlign="left"
                      >
                        <Text
                          $size={13}
                          $weight={600}
                          $color={500}
                          $uppercase
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
                  config.indicators.showMenu ? theme.blue800 : theme.fill300
                }`}
                $background={theme.backgroundDarker}
                $h={34}
                $radius={17}
                $px={0.75}
                $fontSize={13}
                $color={
                  config.indicators.showMenu ? theme.blue800 : theme.fill500
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
                $border={`1px solid ${theme.fill300}`}
                $background={theme.backgroundDarker}
                $h={34}
                $radius={17}
                $px={0.75}
                $fontSize={13}
                $color={theme.fill500}
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
                $border={`1px solid ${theme.fill300}`}
                $background={theme.backgroundDarker}
                $h={34}
                $radius={17}
                $px={0.75}
                $fontSize={13}
                $color={theme.fill500}
                onClick={() =>
                  setConfig({
                    ...config,
                    fullscreen: !config.fullscreen,
                  })
                }
              >
                <Div as={Fullscreen} $w={20} $fill={theme => theme.fill500} />
              </Div>
            )}
            {/* <Button
              $absolute
              $z={2}
              $top={20}
              // $right={fullsize ? 296 + 20 : 20}
              size="small"
              rounded
              onClick={() => setFullsize(!fullsize)}
              $borderColor={theme => theme.fill300}
              aria-label="chart fullsize"
            >
              
            </Button> */}
          </Div>
        </Div>
        {/* <IndicatorsModal
          show={showIndicators}
          onClose={() => setShowIndicators(false)}
        /> */}
      </ThemeProvider>
    </Html>
  );
}
