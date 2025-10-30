import { Div, Text } from '@streamlinedfi/div';
import { ChevronLeft } from '@styled-icons/octicons/ChevronLeft';
import React from 'react';
import arrayReplace from '../../modules/arrayReplace';
import { Screens } from '../../modules/indicators';
import Switch from '../react/Switch';

export default function Indicator({
  context,
  indicator,
  children,
  preSettingsChildren,
}) {
  const { config, setConfig } = context;
  const [key, i] = config.indicators.currentScreenMeta;

  const setValue = (k, v) =>
    setConfig({
      ...config,
      indicators: {
        ...config.indicators,
        [key]: arrayReplace(config.indicators[key], i, ic => ({
          ...ic,
          [k]: v,
        })),
      },
    });

  return (
    <Div $pt={1.25} $flex $col $h="100%">
      <Div
        as="button"
        $px={1}
        $flex
        $mb={1.25}
        onClick={() =>
          setConfig({
            ...config,
            indicators: {
              ...config.indicators,
              currentScreen: Screens.Indicators,
            },
          })
        }
      >
        <Div as={ChevronLeft} $w={16} $color={config.theme.primary} />
        <Text $size={13} $lineH={16} $color={config.theme.primary}>
          Indicators
        </Text>
      </Div>
      <Div $px={1.25} $flex $spaceBetween>
        <Text
          $size={16}
          $lineH={30}
          $weight={600}
          $color={config.theme.indicatorsMenu.titleColor}
          $mb={1.375}
        >
          {indicator.indicator}
        </Text>
        <Switch
          active={indicator.active}
          setActive={active => setValue('active', active)}
        />
      </Div>
      <Div $w="100%" $outerCenter $overflowY="scroll" $maxH={360}>
        {preSettingsChildren}
        <Div $flex $spaceBetween $mb={0.5}>
          <Text
            $px={1.25}
            $size={13}
            $color={config.theme.indicatorsMenu.settingsColor}
          >
            Settings
          </Text>
          <Text
            as="button"
            $px={1.25}
            $size={13}
            $color={config.theme.indicatorsMenu.settingsColor}
            onClick={() => {
              const { active, ...defaults } = config.indicators.defaultConfig[
                indicator.indicator
              ];
              setConfig({
                ...config,
                indicators: {
                  ...config.indicators,
                  [key]: arrayReplace(config.indicators[key], i, ic => ({
                    ...ic,
                    ...defaults,
                  })),
                },
              });
            }}
          >
            Reset Defaults
          </Text>
        </Div>
        {children}
      </Div>
    </Div>
  );
}
