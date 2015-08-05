import React from 'react';
import {Route} from 'react-router';

import Main from 'core/component/main';
import Example from 'core/component/example';

const routes = (
  <Route handler={Main}>
    <Route name='example' handler={Example}/>
  </Route>
);

export default routes;
