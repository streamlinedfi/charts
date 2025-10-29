import React from 'react';
import { transparentize } from 'polished';
import { Html } from 'react-konva-utils';
import { ThemeProvider } from 'styled-components';
import { Layer } from './konva';
import LoaderComponent from '../../Loader';
import useContext from '../modules/useContext';
import theme from '../../../modules/shared/theme';

function Loader({ loading }) {
  const { frame, config } = useContext();
  if (!loading) {
    return null;
  }

  return (
    <Layer>
      <Html divProps={{ style: { width: '100%' } }}>
        <ThemeProvider theme={theme}>
          <LoaderComponent
            $absolute
            $left={frame.mainInner.xStart}
            $top={frame.mainInner.yStart}
            $width={frame.mainInner.width}
            $height={frame.mainInner.height}
            $background={transparentize(0.5, config.theme.bgColor)}
          />
        </ThemeProvider>
      </Html>
    </Layer>
  );
}

export default Loader;
