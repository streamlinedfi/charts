import React from 'react';

function addDOMEventListener(target, event, listener, options) {
  target.addEventListener(event, listener, options);
  return () => target.removeEventListener(event, listener, options);
}

const DISPLAY = {
  BLOCK: 'block',
  FLEX: 'flex',
  INLINE: 'inline',
  INLINE_BLOCK: 'inline-block',
  CONTENTS: 'contents',
};

export default class OutsideClickHandler extends React.Component {
  constructor(...args) {
    super(...args);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.setChildNodeRef = this.setChildNodeRef.bind(this);
  }

  setChildNodeRef(ref) {
    this.childNode = ref;
  }

  addMouseDownEventListener(useCapture) {
    this.removeMouseDown = addDOMEventListener(
      document,
      'mousedown',
      this.onMouseDown,
      { capture: useCapture },
    );
  }

  removeEventListeners() {
    if (this.removeMouseDown) this.removeMouseDown();
    if (this.removeMouseUp) this.removeMouseUp();
  }

  // Use mousedown/mouseup to enforce that clicks remain outside the root's
  // descendant tree, even when dragged. This should also get triggered on
  // touch devices.
  onMouseDown(e) {
    const { useCapture } = this.props;

    const isDescendantOfRoot =
      this.childNode && this.childNode.contains(e.target);
    if (!isDescendantOfRoot) {
      if (this.removeMouseUp) {
        this.removeMouseUp();
        this.removeMouseUp = null;
      }
      this.removeMouseUp = addDOMEventListener(
        document,
        'mouseup',
        this.onMouseUp,
        { capture: useCapture },
      );
    }
  }

  // Use mousedown/mouseup to enforce that clicks remain outside the root's
  // descendant tree, even when dragged. This should also get triggered on
  // touch devices.
  onMouseUp(e) {
    const { onOutsideClick } = this.props;

    const isDescendantOfRoot =
      this.childNode && this.childNode.contains(e.target);
    if (this.removeMouseUp) {
      this.removeMouseUp();
      this.removeMouseUp = null;
    }

    if (!isDescendantOfRoot) {
      onOutsideClick(e);
    }
  }

  componentDidMount() {
    const { disabled, useCapture } = this.props;

    if (!disabled) this.addMouseDownEventListener(useCapture);
  }

  componentDidUpdate({ disabled: prevDisabled }) {
    const { disabled, useCapture } = this.props;
    if (prevDisabled !== disabled) {
      if (disabled) {
        this.removeEventListeners();
      } else {
        this.addMouseDownEventListener(useCapture);
      }
    }
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  render() {
    const { children, display } = this.props;

    return (
      <div
        ref={this.setChildNodeRef}
        style={
          display !== DISPLAY.BLOCK && Object.values(DISPLAY).includes(display)
            ? { display }
            : undefined
        }
      >
        {children}
      </div>
    );
  }
}
