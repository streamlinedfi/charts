import deepmerge from 'deepmerge';
import defaultConfig from './defaultConfig';
import normalizeData from './normalizeData';
import removeNilDeep from './removeNilDeep';

export default function useConfig(instanceConfig) {
  const config = deepmerge(defaultConfig, removeNilDeep(instanceConfig));
  config.data = normalizeData(config);

  return config;
}
