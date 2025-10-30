import React, { forwardRef, lazy, Suspense, useEffect, useState } from 'react';

const Chart = lazy(() => import('./Chart'));

export default forwardRef((props, ref) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <Chart {...props} fwdRef={ref} />
    </Suspense>
  );
});
