import isArray from 'lodash/isArray';
import isEqualWith from 'lodash/isEqualWith';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';

const isEqualProps = (prevProps, nextProps, depth = 9) => {
  const isEqualFn = depth => (prevValue, nextValue) => {
    if (typeof prevValue !== typeof nextValue) {
      return false;
    }

    if (isFunction(prevValue)) {
      return prevValue.toString() === nextValue.toString();
    }

    if (isArray(prevValue)) {
      return (
        prevValue.length === nextValue.length &&
        prevValue.every((value, index) => {
          return isEqualWith(value, nextValue[index], isEqualFn(depth - 1));
        })
      );
    }

    if (prevValue !== null && isObject(prevValue)) {
      if (depth === 0) {
        return true;
      }

      if (prevValue.$$typeof === Symbol.for('react.element')) {
        const isReactEqual =
          prevValue.key === nextValue.key &&
          isEqualWith(prevValue.props, nextValue.props, isEqualFn(depth - 1));
        return isReactEqual;
      }

      return Object.entries(prevValue).every(([key, prevObjectValue]) => {
        try {
          const nextObjectValue = nextValue[key];
          return isEqualWith(
            prevObjectValue,
            nextObjectValue,
            isEqualFn(depth - 1),
          );
        } catch (e) {
          return false;
        }
      });
    }

    return prevValue === nextValue;
  };

  const isEqual = isEqualWith(prevProps, nextProps, isEqualFn(depth));
  return isEqual;
};

export default isEqualProps;
