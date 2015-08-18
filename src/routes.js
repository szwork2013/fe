import React from 'react';
import {Route, DefaultRoute} from 'react-router';

import Application from 'core/page/application';
import Home from 'core/page/home';
import PartyList from 'party/page/partyList';
import LoginPage from 'core/security/loginPage';


const routes = (
  <Route path="/" handler={Application}>

    <DefaultRoute name="home" handler={Home}/>

    <Route name="partyList" path="party"  handler={PartyList}/>
    <Route name="loginPage" path="login"  handler={LoginPage}/>

  </Route>
);

export default routes;
