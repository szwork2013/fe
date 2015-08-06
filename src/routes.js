import React from 'react';
import {Route, DefaultRoute} from 'react-router';

import Application from 'core/container/application';
import Home from 'core/container/home';
import PartyList from 'party/page/partyList';


const routes = (
  <Route path="/" handler={Application}>

    <DefaultRoute name="home" handler={Home}/>

    <Route name="partyList" path="party"  handler={PartyList}/>

  </Route>
);

export default routes;
