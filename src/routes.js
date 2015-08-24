import React from 'react';
import {Route, DefaultRoute} from 'react-router';

import Application from 'core/application/application';
import Home from 'core/home/home';
import PartyList from 'party/page/partyList';
import ContactPersonList from 'party/page/contactPersonList';
import InvoiceList from 'invoicing/page/invoiceList';

import LoginPage from 'core/security/loginPage';


const routes = (
  <Route path="/" handler={Application}>

    <DefaultRoute name="home" handler={Home}/>

    <Route name="loginPage" path="login"  handler={LoginPage}/>

    <Route name="partyList" path="party/list/:gridId?"  handler={PartyList}/>
    <Route name="contactPersonList" path="contact-person"  handler={ContactPersonList}/>

    <Route name="invoiceList" path="invoice"  handler={InvoiceList}/>

  </Route>
);

export default routes;
