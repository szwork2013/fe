import React from 'react'
import When from 'when';
import {fromJS, is, List, Map, Set} from 'immutable'
import {Subject,Observable} from 'rx'

import * as definedRules from 'core/form/rules';

export function and(rules) {
  return When.promise((resolve, reject) => {
    let asyncRules = [];
    let wasPromise = false;
    // resolve all synchronous rules first to prevent server load, save async
    // rules to array to deal with later
    for (let rule of rules) {
      let {fn, args, name} = rule.toJS();
      let result = fn(args);
      if (wasPromise || isPromise(result)) {
        wasPromise = true;
        asyncRules.push({name, result: Promise.resolve(result)})
      } else {
        let {valid, reason} = result;
        if (!valid) {
          resolve({valid: false, error: reason, rule: name});
          return
        }
      }
    }

    When.reduce(asyncRules, (isOk, {name, result}) => {
      if (!isOk) {
        return false
      } else {
        return result
          .then(({valid, reason}) => {
            if (!valid) {
              resolve({valid: false, error: reason, rule: name});
              return false
            } else {
              return true
            }
          })
      }
    }, true).then((isOk) => {
      if (isOk) {
        resolve({valid: true})
      }
    })
  })
}

function isIterable(obj) {
  if (obj == null) return false;
  return obj[Symbol.iterator] !== undefined
}

function isPromise(obj) {
  return typeof obj.then === 'function'
}

function rules(children, args, field, value) {
  children = isIterable(children) ? List(children).toJS() : [children];
  let rules = children.map((c) => {
    return {fn: c.type, args: {value, ...args, ...c.props}, name: c.type.name}
  });

  // pridame definition validatory
  if (field.validators) {
    rules = field.validators.reduce( (acc, v) => {
      let fn = definedRules[v];
      if (!fn) throw new Error('Rule ' + v + ' is not defined');
      rules.push({fn, name: fn.name, args: {value, ...args}});
      return rules;
    }, rules);
  }

 // console.log('rules ', rules);

  // validate the rules
  for (let r of rules) {
    if (typeof r.fn !== 'function') {
      throw new Error('Rule type is not a function');// TODO better message
    }
  }
  return fromJS(rules)
}

// Whether all needTouch rule arguments were touched by user
function allTouched(rules, needTouch, touched) {
  if (needTouch == null) return !touched.isEmpty();
  for (let r of rules) {
    for (let a of r.get('args').keys()) {
      let arg = List([r.get('name'), a]);
      if (needTouch.contains(arg) && !touched.contains(arg)) return false
    }
  }
  return true
}

function touched(prevRules, nextRules) {
  let nonTrivial = (val) => val !== '' && val !== false && val != null;
  let prev = Map();
  for (let r of prevRules) {
    for (let arg of r.get('args').entrySeq()) {
      if (nonTrivial(arg[1])) {
        prev = prev.set(List([r.get('name'), arg[0]]), arg[1])
      }
    }
  }
  let result = Set();
  for (let r of nextRules) {
    for (let arg of r.get('args').entrySeq()) {
      let key = List([r.get('name'), arg[0]]);
      if ((!prev.has(key) && nonTrivial(arg[1])) ||
        (prev.has(key) && prev.get(key) !== arg[1])) {
        result = result.add(key)
      }
      prev = prev.delete(key)
    }
  }
  return result.union(prev.keySeq())
}

export class Validate extends React.Component {

  static defaultProps = {
    args: {},
    children: []
  }

  static propTypes = {
    args: React.PropTypes.any,
    children: React.PropTypes.any,
    needTouch: React.PropTypes.array,
    //onValidation: React.PropTypes.func.isRequired
    field: React.PropTypes.object.isRequired,
    value: React.PropTypes.any
  };

  componentDidMount() {
    let {field, value} = this.props;

    this.subjectStream = new Subject();
    this.touched = new Set();

    this.subjectStream
      .startWith(rules(this.props.children, this.props.args, field, value))
      .flatMapLatest((rules) => Observable.fromPromise(and(rules)))
      .subscribe((validationResult) => {
        field.handleValidation({validationResult})
      });

    this.subjectStream
      .debounce(2000)
      .subscribe((rules) => {
        this.props.field.handleValidation({showValidation:
          allTouched(rules, fromJS(this.props.needTouch), this.touched)})
      })
  }

  componentWillUnmount() {
    this.subjectStream.dispose();
  }

  componentWillReceiveProps(nextProps) {
    let {field, value} = this.props;
    let {field: nextField, value: nextValue} = nextProps;

    // TODO no rules result in showValidation stuck at false
    let rules1 = rules(this.props.children, this.props.args, field, value);
    let rules2 = rules(nextProps.children, nextProps.args, nextField, nextValue);
    if (!is(rules1, rules2)) {
      this.touched = this.touched.union(touched(rules1, rules2));
      field.handleValidation({validationResult: {}, showValidation: false});
      this.subjectStream.onNext(rules2)
    }
  }

  render() {
    return null;
  }
}
