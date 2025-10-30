export default function arrayReplace(array, findIndex, replacement) {
  if (!array || !Array.isArray(array)) {
    return [];
  }

  const replaceIndex =
    typeof findIndex === 'number' ? findIndex : array.findIndex(findIndex);

  if (replaceIndex === -1) {
    return array;
  }

  const newArray = [...array];

  if (typeof replacement === 'function') {
    newArray[replaceIndex] = replacement(array[replaceIndex]);
  } else {
    newArray[replaceIndex] = replacement;
  }

  return newArray;
}
