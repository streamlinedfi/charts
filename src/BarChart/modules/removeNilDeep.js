import isNil from 'lodash/isNil';

const { fromEntries, entries } = Object;

function removeNilDeep(entity) {
  if (Array.isArray(entity)) {
    return entity.map(removeNilDeep).filter(value => !isNil(value));
  }

  if (typeof entity === 'object' && !isNil(entity)) {
    return fromEntries(
      entries(entity)
        .map(([key, value]) => [key, removeNilDeep(value)])
        .filter(([key, value]) => !isNil(value)),
    );
  }

  return entity;
}

export default removeNilDeep;
