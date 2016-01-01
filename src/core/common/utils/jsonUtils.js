
import {isPlainObject, isArray} from 'lodash';

export function stringify(data) {
  return JSON.stringify(data, function(key, value){
    return (key.startsWith('$')) ? undefined : value;
  });
}


function addReference(root, object, level) {
  console.debug('addReference object = %o, level = %s', object, level);

  for (let i in object) {
    let subObject = object[i];

    if (subObject !== null && typeof(subObject) == "object") {
      if (isArray(subObject)) {
        for (let item of subObject) {
          addReference(root, item, level + 1);
          item.$parentArray = subObject;
          item.$parentObject = object;
          item.$rootObject = root;
        }
      } else {
        addReference(root, subObject, level + 1);
        subObject.$parentObject = object;
        subObject.$rootObject = root;
      }
    }

  }
}



export function addReferences(dataObject) {
  addReference(dataObject, dataObject, 0);
  dataObject.$rootObject = dataObject;
  return dataObject;
}


export function walk(object, level, fn) {
  console.debug('walk object = %O, level = %s', object, level);

  fn(object, level);

  for (let i in object) {
    if (i.startsWith && i.startsWith('$')) continue;

    let subObject = object[i];

    if (subObject !== null && typeof(subObject) == "object") {
      if (isArray(subObject)) {
        for (let item of subObject) {
          fn(item, level + 1);
          walk(item, level + 1, fn);
        }
      } else {
        fn(subObject, level + 1);
        walk(subObject, level + 1, fn);
      }
    }

  }
}
