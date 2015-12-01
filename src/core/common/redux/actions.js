function identity(t) {
  return t;
}

export function createAction(type, actionCreator, metaCreator) {
  var finalActionCreator = typeof actionCreator === 'function' ? actionCreator : identity;

  var fn = function () {
    var action = {
      type: type,
      payload: finalActionCreator.apply(undefined, arguments)
    };

    if (typeof metaCreator === 'function') action.meta = metaCreator.apply(undefined, arguments);

    return action;
  };
  fn.type = type;
  return fn;
}


export function createPromiseAction(type, thunk, actionCreator) {

  let types = {
    loading:  type + "_LOADING",
    success: type + "_SUCCESS",
    error: type + "_ERROR"
  };

  var fn = function () {
    var outerArguments = [].slice.call(arguments);
    return function(dispatch, getState) {
      outerArguments.unshift.apply(outerArguments, [dispatch, getState, types]);
      thunk.apply(null, outerArguments);
    };
  };

  Object.assign(fn, types);
  return fn;
}
