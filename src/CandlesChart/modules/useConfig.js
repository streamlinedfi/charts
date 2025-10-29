import deepmerge from 'deepmerge';
import { useEffect, useState } from 'react';
import defaultConfig from './defaultConfig';
import removeNilDeep from './removeNilDeep';

const { stringify: jstr } = JSON;

function getConfig(instanceConfig) {
  return {
    ...deepmerge(defaultConfig, removeNilDeep(instanceConfig)),
    indicators: instanceConfig.indicators || defaultConfig.indicators,
  };
}

export default function useConfig(instanceConfig) {
  const [config, setConfig] = useState(getConfig(instanceConfig));

  useEffect(() => {
    setConfig(getConfig(instanceConfig));
  }, [jstr(instanceConfig)]);

  return [config, setConfig];
}
