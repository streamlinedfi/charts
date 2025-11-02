import React, { forwardRef, lazy, Suspense, useEffect, useState } from 'react';
import Loader from './components/Loader';

const Chart = lazy(() => import('./Chart'));

export default forwardRef((props, ref) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Loader $height={props.config.height} />;
  }

  return (
    <Suspense fallback={<Loader $height={props.config.height} />}>
      <Chart {...props} fwdRef={ref} />
    </Suspense>
  );
});
