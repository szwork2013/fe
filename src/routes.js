import React from 'react';
import {Route, DefaultRoute} from 'react-router';

import Application from 'core/application/application';
import Home from 'core/home/home';

import PartyList from 'party/page/partyList';
import ContactPersonList from 'party/page/contactPersonList';
import SalesRepList from 'party/page/salesRepList';

import PartyDetail from 'party/page/partyDetail';

import InvoiceList from 'invoice/page/invoiceList';
import InvoiceDetail from 'invoice/page/invoiceDetail';
import VehicleList from 'product/page/vehicleList';
import VehicleDetail from 'product/page/vehicleDetail';
import ProductList from 'product/page/productList';
import ProductDetail from 'product/page/productDetail';

import LoginPage from 'core/security/loginPage';

import GridAdminView from 'core/grid/component/gridAdminView';
import ResponsiveTest from 'administration/responsiveTest';


const routes = (
  <Route path="/" handler={Application}>

    <DefaultRoute name="home" handler={Home}/>


    <Route name="loginPage" path="login" handler={LoginPage}/>

    <Route name="partyList" path="party/grid/customer/:gridId?" handler={PartyList}/>
    <Route name="contactPersonList" path="party/grid/contact-person/:gridId?" handler={ContactPersonList}/>
    <Route name="salesRepList" path="party/grid/sales-rep/:gridId?" handler={SalesRepList}/>

    <Route name="partyDetail" path="party/detail/:id" handler={PartyDetail}/>


    <Route name="invoiceList" path="invoice/grid/:gridId?" handler={InvoiceList}/>
    <Route name="invoiceDetail" path="invoice/detail/:id" handler={InvoiceDetail}/>

    <Route name="vehicleList" path="vehicle/grid/:gridId?" handler={VehicleList}/>
    <Route name="vehicleDetail" path="vehicle/detail/:id" handler={VehicleDetail}/>
    <Route name="productList" path="product/grid/:gridId?" handler={ProductList}/>
    <Route name="productDetail" path="product/detail/:id" handler={ProductDetail}/>

    <Route name="gridAdmin" path="core/grid/admin/:gridLocation" handler={GridAdminView}/>

    <Route name="responsiveTest" path="administration/responsive-test" handler={ResponsiveTest}/>


  </Route>
);

export default routes;
