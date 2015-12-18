import {expect} from 'chai';
import React from 'react';
import {renderIntoDocument, scryRenderedDOMComponentsWithTag} from 'react-addons-test-utils';

import {Provider} from 'react-redux';
import Application from 'core/application/application';
import stubRouterContext from '../stubRouterContext';

import {store} from 'core/common/redux/store';

describe('Application', () => {

  it('application is running', () => {
    var Subject = stubRouterContext(Application, {someProp: 'foo'});
    const component = renderIntoDocument(
      <Provider store={store} key="provider">
        <Subject/>
      </Provider>
    );

    const divs = scryRenderedDOMComponentsWithTag(component, 'div');

    expect(divs.length).to.be.above(0);

  });



});


