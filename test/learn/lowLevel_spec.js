import {expect} from 'chai';
import {List, Map, fromJS} from 'immutable';
import {transform} from 'lodash';

import Form from 'core/form/form';


describe('low level', () => {

  // ...

  describe('spread test', () => {

    let obj = {a: 'av', b: 'bv', c: {ca: 'cav', cb: 'cbv'}};
    console.log('obj = ', obj);

    let {a, b, c} = obj;
    console.log(' a= ', a, ', b  = ', b, ', c = ', c);

    let spreaded = {...obj};
    console.log('spreaded = ', spreaded);

    let {a: a2, b: b2, c: c2} = {...obj};
    console.log(' a= ', a2, ', b  = ', b2, ', c = ', c2);

    a2 = 'new';

    console.log(a2);
    console.log(obj);

    c2.ca = 'newCA';
    console.log(obj);

  });

  describe('spread test 2', () => {
    console.log('spread test 2');

    let obj = {a: 'av', b: 'bv', c: {ca: 'cav', cb: 'cbv'}};
    console.log(obj);

    let a = 'newA';

    let newObj = {...obj, a};
    console.log(newObj);

    let newObj2 = {a, ...obj};
    console.log(newObj2);

  });

  describe('class assign', () => {
    console.log('class assign');

    let form = new Form('formik');
    Object.assign(form, {fields: 'ff', open: true});

    console.log(form);

  });



});
