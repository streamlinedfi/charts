const createSetCursor = ref => cursor => {
  // eslint-disable-next-line no-param-reassign
  ref.current.content.style.cursor = cursor;
};

export default createSetCursor;
