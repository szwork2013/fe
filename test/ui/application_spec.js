import {expect} from 'chai';
import React from 'react';
import {renderIntoDocument, scryRenderedDOMComponentsWithTag} from 'react-addons-test-utils';

import Application from 'core/application/application';
import stubRouterContext from '../stubRouterContext';



describe('Application', () => {

  it('application is running', () => {
    var Subject = stubRouterContext(Application, {someProp: 'foo'});
    const component = renderIntoDocument(
        <Subject/>
    );

    const divs = scryRenderedDOMComponentsWithTag(component, 'div');
    
    expect(divs.length).to.be.above(0);

  });



});


