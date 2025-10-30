import { Div } from '@streamlinedfi/div';
import React from 'react';
import ReactDragListView from 'react-drag-listview';
import { createGlobalStyle } from 'styled-components';
import arrayMove from '../../modules/arrayMove';
import useContext from '../../modules/useContext';

const LineStyle = createGlobalStyle`
  .drag-list-line {
    z-index: ${props => props.zIndex} !important;
    border: 1px solid  ${props => props.theme.primary} !important;
  }
`;

const Handle = props => {
  const { config } = useContext();
  return (
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
      $background$hover={config.theme.dragList.handleBgColorHover}
      $mr={0.25}
    >
      <Div
        $w={12}
        $h={2}
        $background={config.theme.dragList.handleColor}
        $mb="2px"
      />
      <Div $w={12} $h={2} $background={config.theme.dragList.handleColor} />
    </Div>
  );
};

export const DragListItem = ({ children, ...props }) => (
  <Div $flex className="drag-list-item" {...props}>
    <Handle />
    {children}
  </Div>
);

export default function DragList({ children, listItems, onDragEnd }) {
  const { config } = useContext();

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
      <LineStyle zIndex={config.theme.dragList.topZIndex} />
    </ReactDragListView>
  );
}
