export default function getBarCoordinate(config, scale) {
  if (!scale) {
    console.log(config);
    console.log(scale);
  }

  const stepWidth =
    scale.x.step() * (1 - config.theme.axes.xInnerSpacingBarMultiplier);
  const bars = config.data.length;

  const barSpace = Math.min(
    Math.max(
      config.theme.bar.minWidth,
      (stepWidth / bars) * config.theme.bar.spaceMultiplier,
    ),
    config.theme.bar.maxSpace,
  );
  const barStepWidth = stepWidth / bars - barSpace;
  const barWidth = Math.min(
    Math.max(config.theme.bar.minWidth, barStepWidth),
    config.theme.bar.maxWidth,
  );

  const getBarX = (datasetI, x) =>
    scale.x(x) + (barWidth + barSpace) * datasetI;

  return { barWidth, getBarX };
}
