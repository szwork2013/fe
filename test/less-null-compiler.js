function noop() {
  return null;
}

require.extensions['.less'] = noop;
// you can add whatever you wanna handle
require.extensions['.css'] = noop;
