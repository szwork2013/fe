import React from 'react';
import {renderIntoDocument, scryRenderedDOMComponentsWithTag} from 'react-addons-test-utils';

import Application from 'core/application/application';



describe('Application', () => {

  it('application is running', () => {
    const component = renderIntoDocument(
        <Application/>
    );

    const divs = scryRenderedDOMComponentsWithTag(component, 'div');

    expect(divs.length).to.be.above(0);

  });



});


