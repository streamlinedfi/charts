/* eslint-disable no-underscore-dangle */
import { useEffect, useRef, useCallback } from 'react';
import Konva from 'konva';
import useContext from './useContext';

const isValidCoordinate = value => {
  return !Number.isNaN(value) && ![0, null, undefined].includes(value);
};

const isValidNode = (type, attrs) => {
  if (
    type === 'Rect' &&
    ![attrs.x, attrs.y, attrs.width, attrs.height].every(isValidCoordinate)
  ) {
    return false;
  }

  if (type === 'Line' && !attrs.points.every(isValidCoordinate)) {
    return false;
  }

  if (
    (type === 'Circle' || type === 'Text') &&
    ![attrs.x, attrs.y].every(isValidCoordinate)
  ) {
    return false;
  }

  return true;
};

export default function useRenderer(layer) {
  const { config, frame } = useContext();
  const queue = useRef([]);
  const ref = useRef({});

  const handleRender = useCallback(
    (renderFn, props) => {
      if (!props || !isValidNode(props.type, props)) {
        return null;
      }

      const { key, show = true } = props;
      const node = ref.current[key];

      if (!show) {
        if (node) {
          node.destroy();
          delete ref.current[key];
        }
        return null;
      }

      const children = renderFn({ config, frame, node, ...props }).filter(
        child => child && isValidNode(child.type, child.attrs),
      );

      if (!children || !children.length) {
        if (node) {
          node.destroy();
          delete ref.current[key];
        }
        return null;
      }

      // update
      if (node) {
        children.forEach((child, i) => {
          try {
            node.children[i].setAttrs(child.attrs);
          } catch (e) {
            //
          }
        });
        return node;
      }

      // create new
      const groupNode = new Konva.Group({ key });
      children.forEach(child => {
        const childNode = new Konva[child.type](child.attrs);
        groupNode.add(childNode);
      });
      layer.add(groupNode);

      ref.current[key] = groupNode;
      return groupNode;
    },
    [layer?._id, JSON.stringify(frame)],
  );

  useEffect(() => {
    if (layer?._id) {
      queue.current.forEach(([renderFn, props]) => {
        handleRender(renderFn, props);
      });
    }
  }, [layer?._id]);

  function renderer(renderFn, props) {
    if (!layer?.add) {
      queue.current.push([renderFn, props]);
      return null;
    }
    return handleRender(renderFn, props);
  }
  renderer.destroy = key => {
    if (ref.current[key]) {
      ref.current[key].destroy();
      delete ref.current[key];
    }
  };
  renderer.destroyAll = () => {
    Object.keys(ref.current).forEach(key => {
      ref.current[key]?.destroy();
      delete ref.current[key];
    });
  };

  return renderer;
}
