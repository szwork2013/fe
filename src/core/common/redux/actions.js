function identity(t) {
  return t;
}

export function createAction(type) {

  var fn = function () {
    var action = {
      type: type,
      payload: arguments[0]
    };

    if (arguments.length > 1) {
      action.caller = arguments[1];
    }

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
      return thunk.apply(null, outerArguments);
    };
  };

  Object.assign(fn, types);
  return fn;
}
