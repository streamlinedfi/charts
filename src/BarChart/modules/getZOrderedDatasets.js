export default function getZOrderedDatasets(config, activeScale) {
  const zOrderedDatasets = config.data
    .map((dataset, index) => [dataset, index])
    .reverse();

  // push topLastValueIndex to the end
  zOrderedDatasets.push(
    zOrderedDatasets.splice(
      zOrderedDatasets.findIndex(([, i]) => i === activeScale),
      1,
    )[0],
  );

  return zOrderedDatasets;
}
