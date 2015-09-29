import React from 'react';
import reactMixin from 'react-mixin';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, CollapsibleNav } from 'react-bootstrap';
import {NavItemLink, MenuItemLink} from 'react-router-bootstrap';
import Router from 'react-router';
import connectToStores from 'alt/utils/connectToStores';
import alt from 'core/common/config/alt-config';

import routes from 'routes';
import SecurityService from 'core/security/securityService';
import CurrentUserActions from 'core/security/currentUserActions';
import CurrentUserStore from 'core/security/currentUserStore';

import Locales from 'core/common/config/locales';

@connectToStores
@reactMixin.decorate(Router.Navigation)
export default class MainMenu extends React.Component {

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  };

  static getStores(props) {
    return [CurrentUserStore];
  }

  static getPropsFromStores(props) {
    return CurrentUserStore.getState();
  }



  /* *******   EVENT HENDLERS ************ */

  logout = (e) => {
    console.log('logout');
    e.preventDefault();

    SecurityService.logout()
      .then((response) => {
        CurrentUserActions.updateCurrentUser(null);
        this.transitionTo('loginPage');
      }, (err) => {
        console.log('logout error');
      });
  };


  onSelectWithTransition = (event, eventKey) => {
    console.log('onSelect2: event = %o, eventKey = %o, target = %o', event, eventKey);
    event.preventDefault();
    this.transitionTo(eventKey);
  };

  onSelectLanguage = (event, eventKey) => {
    console.log('onSelect2: event = %o, eventKey = %o, target = %o', event, eventKey);
    event.preventDefault();
    Locales.lang = eventKey;
    window.location.reload();
  };

  printAppState = (e) => {
    console.debug(alt.takeSnapshot());
  }


  /* *******   REACT METHODS ************ */

  render() {


    let currentUser = this.props.currentUser;

    var userMenuFrag = (
      <NavDropdown eventKey={3} id="user_menu_dropdown" title={currentUser ? (currentUser.displayName + ' (' + currentUser.tenantName + ')' ) : ''}>
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
        <NavItemLink to="home">Home</NavItemLink>
        <NavDropdown id="party_menu_dropdown" title='Party' onSelect={this.onSelectWithTransition}>

          { this._menuItem("partyList") }
          { this._menuItem("contactPersonList") }
          { this._menuItem("salesRepList") }

          { /*  dokud bude rozbity react-router-bootstrap po update react-bootstrap na 0.25
           <MenuItemLink to="partyList" eventKey='1'>Customers</MenuItemLink>
          */}

          <MenuItem divider/>
          <MenuItem eventKey='3'>Administration</MenuItem>
        </NavDropdown>

        <NavDropdown id="invoice_menu_dropdown"  title='Invoice' onSelect={this.onSelectWithTransition}>
          { this._menuItem("invoiceList") }

          <MenuItem divider/>
          <MenuItem eventKey='3'>Administration</MenuItem>
        </NavDropdown>

        <NavDropdown id="administration_dropdown"  title='Administration'>
          <MenuItem eventKey='3' onSelect={this.printAppState}>Print App state</MenuItem>
        </NavDropdown>


      </Nav>
    );

    return (
      <Navbar inverse fixedTop fluid brand={<a href="#">Zauzoo</a>} toggleNavKey={1}>
        <CollapsibleNav eventKey={1}>

          { CurrentUserStore.isLoggedIn() ? mainMenuFrag : '' }

          <Nav navbar right eventKey={12}>
            { CurrentUserStore.isLoggedIn() ? userMenuFrag : '' }
            {languagesFrag}
          </Nav>
        </CollapsibleNav>
      </Navbar>
    );
  }



  _menuItem(route, title, icon) {
    //console.log('_menuItem: ', routes);
    //console.log('this.context.router', this.context.router);

    let routeObj = this.context.router.namedRoutes[route];
    let routeHandler = (routeObj) ? routeObj.handler : null;
    let resolvedIcon = (icon) ? icon : ((routeHandler) ? routeHandler.icon : null);
    let resolvedIconClassname = (resolvedIcon) ? ('fa fa-' + resolvedIcon.replace(/^fa-/, '')) : null;
    let resolvedTitle = (title) ? title : ((routeHandler) ? routeHandler.title : null);

    var href = this.makeHref(route);
    //var isActive = this.isActive('destination', {some: 'params'}, {some: 'query param'});
    var iconElement = (resolvedIconClassname) ? <span className={resolvedIconClassname}/> :  '';

    return <MenuItem href={href} eventKey={route}> {iconElement} {resolvedTitle} </MenuItem>;
  }

}
