import React from 'react';
import reactMixin from 'react-mixin';
import { connect } from 'react-redux'
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, CollapsibleNav } from 'react-bootstrap';
import Router from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import SecurityService from 'core/security/securityService';
import * as securityActions from 'core/security/securityActions';
import { LoginFormRecord } from 'core/security/loginForm';

import Locales from 'core/common/config/locales';



function mapStateToProps(state) {
  return {
    currentUser: state.getIn(['security', 'currentUser'])
  };
}


@connect(mapStateToProps, securityActions)
export default class MainMenu extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  };



  /* *******   EVENT HENDLERS ************ */

  logout = (e) => {
    console.log('logout');
    e.preventDefault();

    SecurityService.logout()
      .then((response) => {
        this.props.setCurrentUserAction(null);
        this.props.setLoginFormDataAction(new LoginFormRecord());
        this.context.router.transitionTo('loginPage');
      }, (err) => {
        console.log('logout error');
      });
  };


  onSelectWithTransition = (event, eventKey) => {
    console.log('onSelect2: event = %o, eventKey = %o', event, eventKey);
    event.preventDefault();
    this.context.router.transitionTo(eventKey);
  };

  onSelectLanguage = (event, eventKey) => {
    console.log('onSelect2: event = %o, eventKey = %o', event, eventKey);
    event.preventDefault();
    Locales.lang = eventKey;
    window.location.reload();
  };


  onHome = (event) => {
    event.preventDefault();
    this.context.router.transitionTo("home");
  };



  /* *******   REACT METHODS ************ */

  render() {


    const {
      currentUser
      } = this.props;

    //console.log('MAIN MENU CURRENT USER : ' + currentUser);


    var userMenuFrag = (
      <NavDropdown eventKey={3} id="user_menu_dropdown" title={currentUser ? (currentUser.get('displayName') + ' (' + currentUser.get('tenantName') + ')' ) : ''}>
        <MenuItem eventKey='1' onSelect={this.logout}>Logout</MenuItem>
      </NavDropdown>
    );



    var languagesFrag = (
      <NavDropdown id="languages_menu_dropdown" eventKey={3} title={ <span><i className="fa fa-file"></i> {Locales.lang} </span> } >
          {
            Locales.available.filter(x => x !== Locales.lang).map((locale) => {
              return (
                <MenuItem eventKey={locale} key={locale} onSelect={this.onSelectLanguage}>{locale}</MenuItem>
              );
            })
          }
      </NavDropdown>
    );


    var mainMenuFrag = (
      <Nav navbar eventKey={11}>
        <NavDropdown id="party_menu_dropdown" title='Party' onSelect={this.onSelectWithTransition}>

          { this._menuItem("partyCustomers") }
          { this._menuItem("partyContacts") }
          { this._menuItem("partySalesReps") }


          <MenuItem divider/>
          <MenuItem eventKey='3'>Administration</MenuItem>
        </NavDropdown>

        <NavDropdown id="invoice_menu_dropdown"  title='Invoice' onSelect={this.onSelectWithTransition}>
          { this._menuItem("invoiceList") }

          <MenuItem divider/>
          <MenuItem eventKey='3'>Administration</MenuItem>
        </NavDropdown>

        <NavDropdown id="assets_menu_dropdown"  title='Assets' onSelect={this.onSelectWithTransition}>
          { this._menuItem("vehicleList") }
          <MenuItem divider/>
          <MenuItem eventKey='3'>Administration</MenuItem>
        </NavDropdown>

        <NavDropdown id="product_menu_dropdown"  title='Products' onSelect={this.onSelectWithTransition}>
          { this._menuItem("productList") }
          <MenuItem divider/>
          <MenuItem eventKey='3'>Administration</MenuItem>
        </NavDropdown>

        <NavDropdown id="administration_dropdown"  title='Administration' onSelect={this.onSelectWithTransition}>
          { this._menuItem("userList") }
          { this._menuItem("entityList") }
          { this._menuItem("gridLocationList") }
        </NavDropdown>


      </Nav>
    );

    return (
      <Navbar inverse fixedTop fluid>

        <Navbar.Header>
          <Navbar.Brand>
            <a href={this.context.router.makeHref('home')} eventKey={'home'} onClick={this.onHome}>Zauzoo</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>

        <Navbar.Collapse>

          { currentUser ? mainMenuFrag : '' }

          <Nav navbar pullRight eventKey={12}>
            { currentUser ? userMenuFrag : '' }
            {languagesFrag}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }


  _menuItem(route, title, icon) {
    let routeObj = this.context.router.namedRoutes[route];
    let routeHandler = (routeObj) ? routeObj.handler : null;
    let resolvedIcon = (icon) ? icon : ((routeHandler) ? routeHandler.icon : null);
    let resolvedIconClassname = (resolvedIcon) ? ('fa fa-' + resolvedIcon.replace(/^fa-/, '')) : null;
    let resolvedTitle = (title) ? title : ((routeHandler) ? routeHandler.title : null);

    var href = this.context.router.makeHref(route);
    //var isActive = this.isActive('destination', {some: 'params'}, {some: 'query param'});
    var iconElement = (resolvedIconClassname) ? <span className={resolvedIconClassname}/> :  '';

    return <MenuItem href={href} eventKey={route}> {iconElement} {resolvedTitle} </MenuItem>;
  }

}
