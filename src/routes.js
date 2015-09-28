import React from 'react';
import {Route, DefaultRoute} from 'react-router';

import Application from 'core/application/application';
import Home from 'core/home/home';

import PartyList from 'party/page/partyList';
import ContactPersonList from 'party/page/contactPersonList';
import SalesRepList from 'party/page/salesRepList';

import PartyDetail from 'party/page/partyDetail';

import InvoiceList from 'invoicing/page/invoiceList';

import LoginPage from 'core/security/loginPage';

import GridAdminView from 'core/grid/component/gridAdminView';


const routes = (
  <Route path="/" handler={Application}>

    <DefaultRoute name="home" handler={Home}/>


    <Route name="loginPage" path="login"  handler={LoginPage}/>

    <Route name="partyList" path="party/customer/list/:gridId?"  handler={PartyList}/>
    <Route name="contactPersonList" path="party/contact-person/list/:gridId?"  handler={ContactPersonList}/>
    <Route name="salesRepList" path="party/sales-rep/list/:gridId?"  handler={SalesRepList}/>

    <Route name="partyDetail" path="party/customer/list/:gridId?"  handler={PartyDetail}/>


    <Route name="invoiceList" path="invoice/list/:gridId?"  handler={InvoiceList}/>

    <Route name="gridAdmin" path="core/grid/admin/:gridLocation"  handler={GridAdminView}/>


  </Route>
);

export default routes;
