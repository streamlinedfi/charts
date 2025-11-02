import React, { forwardRef } from 'react';
import {
  Stage as KonvaStage,
  Layer as KonvaLayer,
  Group as KonvaGroup,
  Rect as KonvaRect,
  Circle as KonvaCircle,
  Text as KonvaText,
  Line as KonvaLine,
  Image as KonvaImage,
} from 'react-konva';

// preventDefault to allow scrolling on mobile (touch)
export const Stage = forwardRef((props, ref) => (
  <KonvaStage ref={ref} {...props} preventDefault={false} />
));
export const Layer = forwardRef((props, ref) => (
  <KonvaLayer ref={ref} {...props} preventDefault={false} />
));
export const Group = forwardRef((props, ref) => (
  <KonvaGroup ref={ref} {...props} preventDefault={false} />
));
export const Rect = forwardRef((props, ref) => (
  <KonvaRect ref={ref} {...props} preventDefault={false} />
));
export const Circle = forwardRef((props, ref) => (
  <KonvaCircle ref={ref} {...props} preventDefault={false} />
));
export const Text = forwardRef((props, ref) => (
  <KonvaText ref={ref} {...props} preventDefault={false} />
));
export const Line = forwardRef((props, ref) => (
  <KonvaLine ref={ref} {...props} preventDefault={false} />
));
export const Image = forwardRef((props, ref) => (
  <KonvaImage ref={ref} {...props} preventDefault={false} />
));
