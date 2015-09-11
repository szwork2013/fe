export function areArraysEqual(a, b) {
  if (!a || !b) return false;

  if (a.length != b.length) return false;

  for (var i = 0, length = a.length; i < length; i++) {
    if (a[i] != b[i]) return false;
  }

  return true;
}

export function topDifference(element, container) {
  return topFromWindow(element) - topFromWindow(container);
}

export function topFromWindow(element) {
  if (!element || element === window) return 0;

  return element.offsetTop + topFromWindow(element.offsetParent);
}

export function debounce(func, wait, immediate) {
  if (!wait) return func;

  var timeout;

  return function() {
    var context = this, args = arguments;

    var later = function() {
      timeout = null;

      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}
