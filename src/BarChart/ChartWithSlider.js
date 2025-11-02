import { Div } from '@streamlinedfi/div';
import React, { forwardRef, useEffect, useState } from 'react';
import BarChart from './Chart';
import ControlSlider from './components/ControlSlider';
import Loader from './components/Loader';

export default forwardRef(function ChartWithSlider(
  { config, data, initSlices = [-16, 0] },
  ref,
) {
  const steps = data?.length;
  const [slices, setSlices] = useState(initSlices);
  const [sliceStart, sliceEnd] = slices;

  useEffect(() => {
    setSlices(initSlices);
  }, [steps]);

  const series = [...(data || [])]
    .reverse()
    .slice(Math.max(0, steps + sliceStart), steps + sliceEnd);

  return (
    <div ref={ref}>
      {series?.length ? (
        <>
          <BarChart config={config} data={series} />
          <Div $pt={1}>
            <ControlSlider
              max={steps}
              value={slices.map(v => v + steps)}
              onInput={([min, max]) => {
                setSlices([min - steps, max - steps]);
              }}
              theme={config.theme.slider}
            />
          </Div>
        </>
      ) : (
        <Loader $height={config.height} />
      )}
    </div>
  );
});
