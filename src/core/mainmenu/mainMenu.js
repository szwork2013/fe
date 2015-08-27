import React from 'react';
import reactMixin from 'react-mixin';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, CollapsibleNav } from 'react-bootstrap';
import {NavItemLink, MenuItemLink} from 'react-router-bootstrap';
import Router from 'react-router';
import connectToStores from 'alt/utils/connectToStores';

import SecurityService from 'core/security/securityService';
import CurrentUserActions from 'core/security/currentUserActions';
import CurrentUserStore from 'core/security/currentUserStore';


@connectToStores
@reactMixin.decorate(Router.Navigation)
export default class MainMenu extends React.Component {


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
  }


  /* *******   REACT METHODS ************ */

  render() {


    let currentUser = this.props.currentUser;

    var userMenuFrag = (
      <NavDropdown eventKey={3} title={currentUser ? (currentUser.displayName + ' (' + currentUser.tenantName + ')' ) : ''}>
        <MenuItem eventKey='1' onSelect={this.logout}>Logout</MenuItem>
      </NavDropdown>
    );



    var mainMenuFrag = (
      <Nav navbar>
        <NavItemLink to="home" eventKey={1}>Home</NavItemLink>
        <NavDropdown title='Party' onSelect={this.onSelectWithTransition}>

          { this._menuItem("partyList", "Customers") }
          { this._menuItem("contactPersonList", "Contact persons") }

          { /*  dokud bude rozbity react-router-bootstrap po update react-bootstrap na 0.25
           <MenuItemLink to="partyList" eventKey='1'>Customers</MenuItemLink>
          */}

          <MenuItem divider/>
          <MenuItem eventKey='3'>Administration</MenuItem>
        </NavDropdown>

        <NavDropdown eventKey={3} title='Invoice' onSelect={this.onSelectWithTransition}>
          { this._menuItem("invoiceList", "Invoices") }

          <MenuItem divider/>
          <MenuItem eventKey='3'>Administration</MenuItem>
        </NavDropdown>


      </Nav>
    );

    return (
      <Navbar inverse fixedTop fluid brand={<a href="#">Zauzoo</a>} toggleNavKey={0}>
        <CollapsibleNav eventKey={0}>

          { CurrentUserStore.isLoggedIn() ? mainMenuFrag : '' }

          <Nav navbar right>
            { CurrentUserStore.isLoggedIn() ? userMenuFrag : '' }
            <NavItem eventKey={1} href='#'>Language</NavItem>
          </Nav>
        </CollapsibleNav>
      </Navbar>
    );
  }


  onSelectWithTransition = (event, eventKey) => {
    console.log('onSelect2: event = %o, eventKey = %o, target = %o', event, eventKey);
    event.preventDefault();
    this.transitionTo(eventKey);
  };

  _menuItem(route, label) {
    var href = this.makeHref(route);
    //var isActive = this.isActive('destination', {some: 'params'}, {some: 'query param'});
    return <MenuItem href={href} eventKey={route}> {label} </MenuItem>;
  }

}
