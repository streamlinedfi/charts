import { Div, Text } from '@streamlinedfi/div';
import { Plus as PlusIcon } from '@styled-icons/evaicons-solid/Plus';
import sortBy from 'lodash/sortBy';
import React, { useState } from 'react';
import arrayReplace from '../../modules/arrayReplace';
import { Indicators } from '../../modules/indicators';
import useContext from '../../modules/useContext';
import DragList, { DragListItem } from '../react/DragList';
import PopoverMenu from '../react/PopoverMenu';
import Separator from '../react/Separator';
import Switch from '../react/Switch';

const indicatorTextMapping = {
  [Indicators.RSI]: 'RSI',
  [Indicators.ATR]: 'ATR',
  [Indicators.ROC]: 'ROC',
};

function IndicatorItem({
  indicator,
  setActive,
  setScreen,
  hasDuplicates,
  setRemove,
  ...props
}) {
  const { config } = useContext();
  return (
    <Div $flex $h={48} $innerCenter $spaceBetween $px={1.25} {...props}>
      <Div $flex $w="auto" $h="100%" $innerCenter $innerLeft>
        <Text
          $size={13}
          $color={config.theme.indicatorsMenu.indicatorTextColor}
          $mr={0.5}
        >
          {indicatorTextMapping[indicator.indicator] || indicator.indicator}
        </Text>
        <Text $size={13} $color={config.theme.indicatorsMenu.settingsColor}>
          {[
            indicator.length,
            indicator.type,
            indicator.stdDev,
            indicator.fastLength,
            indicator.slowLength,
            indicator.signalLineLength,
            indicator.kLength,
            indicator.kSmoothing,
            indicator.dSmoothing,
          ]
            .filter(Boolean)
            .join(' ')}
        </Text>
      </Div>
      <Div $flex $w="auto" $h="100%" $innerCenter $innerLeft>
        <Text
          as="button"
          $size={13}
          $color={
            indicator.active
              ? config.theme.indicatorsMenu.settingsColorActive
              : config.theme.indicatorsMenu.settingsColor
          }
          $mr={0.5}
          onClick={() => setScreen(indicator)}
        >
          Settings
        </Text>
        <Switch
          active={indicator.active}
          setActive={setActive}
          outerWidth={40}
          outerHeight={26}
          innerSize={22}
          innerMargin={2}
        />
        {hasDuplicates && (
          <Div $w={24}>
            {setRemove && (
              <Div as="button" onClick={setRemove}>
                <Div
                  as={PlusIcon}
                  $w={20}
                  $relative
                  $left={4}
                  $fill={config.theme.indicatorsMenu.removeIconColor}
                  $transform="rotate(45deg)"
                />
              </Div>
            )}
          </Div>
        )}
      </Div>
    </Div>
  );
}

export default function IndicatorsScreen({ context }) {
  // const context = useContext();
  const { config, setConfig } = context;
  const [showAddMenu, setShowAddMenu] = useState();

  const indicatorsWithWindows = sortBy(config.indicators.windows, 'order');
  const mainIndicators = config.indicators.mainChart.map(ic => ic.indicator);
  const hasDuplicates = !!mainIndicators.filter(
    (item, index) => mainIndicators.indexOf(item) !== index,
  ).length;

  const setWindows = nextOrderedWindows => {
    setConfig({
      ...config,
      indicators: {
        ...config.indicators,
        windows: nextOrderedWindows.map((indicator, i) => ({
          ...indicator,
          order: i,
        })),
      },
    });
  };

  const setScreen = (key, i) => indicator =>
    setConfig({
      ...config,
      indicators: {
        ...config.indicators,
        currentScreen: indicator.indicator,
        currentScreenMeta: [key, i],
      },
    });

  const setActive = (key, i) => active =>
    setConfig({
      ...config,
      indicators: {
        ...config.indicators,
        [key]: arrayReplace(config.indicators[key], i, indicator => ({
          ...indicator,
          active,
        })),
      },
    });

  const setRemove = i => () =>
    setConfig({
      ...config,
      indicators: {
        ...config.indicators,
        mainChart: arrayReplace(config.indicators.mainChart, i, indicator => ({
          ...indicator,
          active: false,
          shouldRemove: true,
        })),
      },
    });

  return (
    <Div $py={1.25}>
      <Div $mb={1.5}>
        <Div $px={1.25} $flex $spaceBetween $mobile$justifyContent="flex-start">
          <Text
            $size={13}
            $color={config.theme.indicatorsMenu.subtitleColor}
            $mb={0.5}
          >
            Main chart
          </Text>
          <Div $relative $mobile$left={8} $mobile$top={-1}>
            <Div as="button" onClick={() => setShowAddMenu(true)}>
              <Div
                as={PlusIcon}
                $w={20}
                $fill={
                  showAddMenu
                    ? config.theme.indicatorsMenu.addIconColorActive
                    : config.theme.indicatorsMenu.addIconColor
                }
                $transition
                $transform={showAddMenu ? 'rotate(90deg)' : 'rotate(0deg)'}
              />
            </Div>
            {showAddMenu && (
              <PopoverMenu
                showAngle
                show={showAddMenu}
                setShow={setShowAddMenu}
                y="bottom"
                xOffset={-20}
                x="left"
                $background={config.theme.popoverMenu.bgColor}
                items={[
                  {
                    type: 'item',
                    props: {
                      text: Indicators.MA,
                      onClick: () =>
                        setConfig({
                          ...config,
                          indicators: {
                            ...config.indicators,
                            mainChart: [
                              ...config.indicators.mainChart,
                              {
                                ...config.indicators.defaultConfig[
                                  Indicators.MA
                                ],
                                color:
                                  config.indicators.defaultConfig[
                                    Indicators.MA
                                  ].colorOptions.find(color =>
                                    config.indicators.mainChart.some(
                                      ic => ic.color !== color,
                                    ),
                                  ) ||
                                  config.indicators.defaultConfig[Indicators.MA]
                                    .color,
                              },
                            ],
                          },
                        }),
                    },
                  },
                ]}
              />
            )}
          </Div>
        </Div>
        <Separator $my="0" />
        {config.indicators.mainChart.map((indicator, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={i}>
            <IndicatorItem
              indicator={indicator}
              setScreen={setScreen('mainChart', i)}
              setActive={setActive('mainChart', i)}
              hasDuplicates={hasDuplicates}
              setRemove={hasDuplicates && i > 0 ? setRemove(i) : undefined}
            />
            <Separator $my="0" />
          </React.Fragment>
        ))}
      </Div>
      <Div>
        <Text
          $px={1.25}
          $size={13}
          $color={config.theme.indicatorsMenu.subtitleColor}
          $mb={0.5}
        >
          Indicator windows
        </Text>
        <DragList listItems={indicatorsWithWindows} onDragEnd={setWindows}>
          {indicatorsWithWindows.map((indicator, i) => (
            <DragListItem
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              $px={1.25}
              $borderTop={config.theme.dragList.borderColor}
              $borderBottom={config.theme.dragList.borderColor}
              $mb="-1px"
              $background$hover={config.theme.dragList.bgColorHover}
            >
              <IndicatorItem
                indicator={indicator}
                setScreen={setScreen('windows', i)}
                setActive={setActive('windows', i)}
                $px="0"
              />
            </DragListItem>
          ))}
        </DragList>
      </Div>
    </Div>
  );
}
