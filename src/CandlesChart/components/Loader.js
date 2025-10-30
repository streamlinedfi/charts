import { transparentize } from 'polished';
import React from 'react';
import { Html } from 'react-konva-utils';
import useContext from '../modules/useContext';
import { Layer } from './konva';
import LoaderComponent from './react/Loader';

function Loader({ loading }) {
  const { frame, config } = useContext();
  if (!loading) {
    return null;
  }

  return (
    <Layer>
      <Html divProps={{ style: { width: '100%' } }}>
        <LoaderComponent
          $absolute
          $left={frame.mainInner.xStart}
          $top={frame.mainInner.yStart}
          $width={frame.mainInner.width}
          $height={frame.mainInner.height}
          $background={transparentize(0.5, config.theme.bgColor)}
        />
      </Html>
    </Layer>
  );
}

export default Loader;
