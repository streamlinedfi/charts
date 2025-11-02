/* eslint-disable no-multi-assign */
function onVisibilityChange(callback) {
  var visible = true;

  if (!callback) {
    throw new Error('no callback given');
  }

  function focused() {
    if (!visible) {
      callback((visible = true));
    }
  }

  function unfocused() {
    if (visible) {
      callback((visible = false));
    }
  }

  // Standards:
  if ('hidden' in document) {
    visible = !document.hidden;
    document.addEventListener('visibilitychange', function() {
      (document.hidden ? unfocused : focused)();
    });
  }
  if ('mozHidden' in document) {
    visible = !document.mozHidden;
    document.addEventListener('mozvisibilitychange', function() {
      (document.mozHidden ? unfocused : focused)();
    });
  }
  if ('webkitHidden' in document) {
    visible = !document.webkitHidden;
    document.addEventListener('webkitvisibilitychange', function() {
      (document.webkitHidden ? unfocused : focused)();
    });
  }
  if ('msHidden' in document) {
    visible = !document.msHidden;
    document.addEventListener('msvisibilitychange', function() {
      (document.msHidden ? unfocused : focused)();
    });
  }
  // IE 9 and lower:
  if ('onfocusin' in document) {
    document.onfocusin = focused;
    document.onfocusout = unfocused;
  }
  // All others:
  window.onpageshow = window.onfocus = focused;
  window.onpagehide = window.onblur = unfocused;
}

export default onVisibilityChange;
