import React, { forwardRef } from 'react';
import {
  Circle as KonvaCircle,
  Group as KonvaGroup,
  Image as KonvaImage,
  Layer as KonvaLayer,
  Line as KonvaLine,
  Rect as KonvaRect,
  Stage as KonvaStage,
  Text as KonvaText,
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
