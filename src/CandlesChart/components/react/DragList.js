import { Div } from '@streamlinedfi/div';
import React from 'react';
import ReactDragListView from 'react-drag-listview';
import { createGlobalStyle } from 'styled-components';
import arrayMove from '../../modules/arrayMove';

const LineStyle = createGlobalStyle`
  .drag-list-line {
    z-index: ${theme.zIndices.absoluteTop} !important;
    border: 1px solid  ${props => props.theme.primary} !important;
  }
`;

const Handle = props => (
  <Div
    className="drag-list-handle"
    $flex
    $col
    $shrink="0"
    $innerCenter
    $w={24}
    $minH="100%"
    $cursor="grab"
    $radius={8}
    $background$hover={theme => theme.backgroundDarkest}
    $mr={0.25}
  >
    <Div $w={12} $h={2} $background={theme => theme.fill300} $mb="2px" />
    <Div $w={12} $h={2} $background={theme => theme.fill300} />
  </Div>
);

export const DragListItem = ({ children, ...props }) => (
  <Div $flex className="drag-list-item" {...props}>
    <Handle />
    {children}
  </Div>
);

export default function DragList({ children, listItems, onDragEnd }) {
  return (
    <ReactDragListView
      onDragEnd={(fromIndex, toIndex) => {
        onDragEnd(arrayMove(listItems, fromIndex, toIndex));
      }}
      nodeSelector=".drag-list-item"
      handleSelector=".drag-list-handle"
      lineClassName="drag-list-line"
    >
      {children}
      <LineStyle />
    </ReactDragListView>
  );
}
