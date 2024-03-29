import React from 'react';
import {Route, DefaultRoute} from 'react-router';

import Application from 'core/application/application';
import Home from 'core/home/home';

import CustomerList from 'party/page/customerList';
import ContactPersonList from 'party/page/contactPersonList';
import SalesRepList from 'party/page/salesRepList';
import PartyList from 'party/page/partyList';

import PartyDetail from 'party/page/partyDetail';

import InvoiceList from 'invoice/page/invoiceList';
import InvoiceDetail from 'invoice/page/invoiceDetail';
import VehicleList from 'product/page/vehicleList';
import VehicleDetail from 'product/page/vehicleDetail';
import ProductList from 'product/page/productList';
import ProductDetail from 'product/page/productDetail';
import UserList from 'core/security/userList';
import UserDetail from 'core/security/userDetail';
import UserProfile from 'core/security/userProfile';
import SetPassword from 'core/security/setPassword';

import LoginPage from 'core/security/loginPage';
import EntityList from 'core/metamodel/entityList';
import GridLocationList from 'core/grid/gridLocationList';
import GridLocationDetail from 'core/grid/gridLocationDetail';

import GridAdminView from 'core/grid/component/gridAdminView';
import ResponsiveTest from 'administration/responsiveTest';


const routes = (
  <Route path="/" handler={Application}>

    <DefaultRoute name="home" handler={Home}/>


    <Route name="loginPage" path="login" handler={LoginPage}/>
    <Route name="entityList" path="core/entity/:gridId?" handler={EntityList}/>
    <Route name="gridLocationList" path="core/grid-location/:gridId?" handler={GridLocationList}/>
    <Route name="gridLocationDetail" path="core/grid-location/detail/:id?" handler={GridLocationDetail}/>



    <Route name="partyCustomers" path="party/grid/customer/:gridId?" handler={CustomerList}/>
    <Route name="partyContacts" path="party/grid/contact-person/:gridId?" handler={ContactPersonList}/>
    <Route name="partySalesReps" path="party/grid/sales-rep/:gridId?" handler={SalesRepList}/>
    <Route name="partyAll" path="party/grid/all/:gridId?" handler={PartyList}/>
    <Route name="partyDetail" path="party/detail/:id" handler={PartyDetail}/>


    <Route name="invoiceList" path="invoice/grid/:gridId?" handler={InvoiceList}/>
    <Route name="invoiceDetail" path="invoice/detail/:id" handler={InvoiceDetail}/>

    <Route name="vehicleList" path="vehicle/grid/:gridId?" handler={VehicleList}/>
    <Route name="vehicleDetail" path="vehicle/detail/:id" handler={VehicleDetail}/>

    <Route name="productList" path="product/grid/:gridId?" handler={ProductList}/>
    <Route name="productDetail" path="product/detail/:id" handler={ProductDetail}/>

    <Route name="userList" path="user/grid/:gridId?" handler={UserList}/>
    <Route name="userDetail" path="user/detail/:id" handler={UserDetail}/>
    <Route name="userProfile" path="user/profile" handler={UserProfile}/>
    <Route name="setPassword" path="user/set-password/:mode/:id?" handler={SetPassword}/>

    <Route name="gridAdmin" path="core/grid/admin/:gridLocation" handler={GridAdminView}/>

    <Route name="responsiveTest" path="administration/responsive-test" handler={ResponsiveTest}/>


  </Route>
);

export default routes;
