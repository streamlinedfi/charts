import Element from './Element';

export default function useTools({ state, on }) {
  on('click', () => {
    if (state.cursor.x && state.tool === 'line') {
      const lastLineDrawings = state.elements.filter(
        element => element.type === Element.Types.LineDrawing,
      );

      const lastLineDrawing = lastLineDrawings[lastLineDrawings.length - 1];

      if (!lastLineDrawings.length || lastLineDrawing.coordinates[1]) {
        state.elements.push(
          new Element({
            type: Element.Types.LineDrawing,
            isInteractive: true,
            coordinates: [[state.cursor.x, state.cursor.y]],
            isSelected: true,
          }),
        );
      } else {
        lastLineDrawing.coordinates.push([state.cursor.x, state.cursor.y]);
        lastLineDrawing.isSelected = false;
      }
    }

    if (state.cursor.x && state.tool === 'hline') {
      state.elements.push(
        new Element({
          type: Element.Types.HLineDrawing,
          isInteractive: true,
          coordinates: [[state.cursor.x, state.cursor.y]],
          isSelected: true,
        }),
      );
    }

    if (state.cursor.x && state.tool === 'vline') {
      state.elements.push(
        new Element({
          type: Element.Types.VLineDrawing,
          isInteractive: true,
          coordinates: [[state.cursor.x, state.cursor.y]],
          isSelected: true,
          onMouseDown() {
            if (this.isInRange()) {
              this.isSelected = true;
              this.isMoving = true;
            }
          },
          // onmouseup() {
          //   this.is
          // }
        }),
      );
    }
  });
}
