/* eslint-disable no-underscore-dangle */
import { useEffect, useRef, useCallback, useState } from 'react';
import Konva from 'konva';
import useContext from './useContext';

const { keys, values } = Object;

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
  const queue = useRef({});
  const nodes = useRef({});
  const [didMount, setDidMount] = useState();

  useEffect(() => {
    setDidMount(true);
    return () => setDidMount(false);
  }, []);

  const handleRender = useCallback(
    (renderFn, props) => {
      if (!props || !isValidNode(props.type, props)) {
        return null;
      }

      const { key, show = true } = props;
      if (key === undefined || key === null) {
        throw new Error(
          `renderer(fn, props) props has no key ${JSON.stringify(
            props,
            null,
            2,
          )} ${renderFn}`,
        );
      }
      const node = nodes.current[key];

      if (!show) {
        if (node) {
          node.destroy();
          delete nodes.current[key];
        }
        return null;
      }

      const children = renderFn({ config, frame, node, ...props }).filter(
        Boolean,
      );

      if (!children || !children.length) {
        if (node) {
          node.destroy();
          delete nodes.current[key];
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
        try {
          const childNode = new Konva[child.type](child.attrs);
          groupNode.add(childNode);
        } catch (e) {
          console.error(e.stack);
          console.error(child);
        }
      });
      layer.add(groupNode);

      nodes.current[key] = groupNode;
      return groupNode;
    },
    [layer?._id, JSON.stringify(frame)],
  );

  useEffect(() => {
    if (didMount && layer?._id) {
      values(queue.current).forEach(([renderFn, props]) => {
        handleRender(renderFn, props);
        delete queue.current[props.key];
      });
    }
  }, [didMount, layer?._id]);

  function renderer(renderFn, props) {
    if (!didMount || !layer?.add) {
      queue.current[props.key] = [renderFn, props];
      return null;
    }
    return handleRender(renderFn, props);
  }
  renderer.queue = queue.current;
  renderer.nodes = nodes.current;
  renderer.destroy = key => {
    if (nodes.current[key]) {
      nodes.current[key].destroy();
      delete nodes.current[key];
    }
  };
  renderer.destroyAllWith = key => {
    keys(nodes.current)
      .filter(k => k.startsWith(key))
      .forEach(k => {
        nodes.current[k].destroy();
        delete nodes.current[k];
        layer.draw();
      });
  };
  renderer.destroyAll = () => {
    Object.keys(nodes.current).forEach(key => {
      nodes.current[key]?.destroy();
      delete nodes.current[key];
    });
  };

  return renderer;
}
