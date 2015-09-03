var REACT_STATICS = {
  childContextTypes: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  mixins: true,
  propTypes: true,
  type: true,

  name: true,
  length: true,
  prototype: true,
  caller: true,
  arguments: true,
  arity: true
};


export default function hoistNonReactStatics(targetComponent, sourceComponent) {
  for(let p in sourceComponent) {
    if (!REACT_STATICS[p]) {
      targetComponent[p] = sourceComponent[p];
    }
  }
  return targetComponent;
};
