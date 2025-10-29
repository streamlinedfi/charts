import { useState, useEffect } from 'react';
import deepmerge from 'deepmerge';
import defaultConfig from './defaultConfig';
import removeNilDeep from '../../../modules/removeNilDeep';

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
