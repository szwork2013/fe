import React from 'react';
import reactMixin from 'react-mixin';
import {Navbar, Nav, NavItem, DropdownButton, MenuItem, CollapsibleNav } from 'react-bootstrap';
import * as RRB from 'react-router-bootstrap';
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
      <DropdownButton eventKey={3} title={currentUser ? currentUser.displayName : ''} onSelect={this.onSelect}>
        <MenuItem eventKey='1' onClick={this.logout}>Logout</MenuItem>
      </DropdownButton>
    );

    var mainMenuFrag = (
      <Nav navbar>
        <RRB.NavItemLink to="home" eventKey={1}>Home</RRB.NavItemLink>
        <DropdownButton eventKey={2} title='Party' onSelect={this.onSelect}>
          <RRB.MenuItemLink to="partyList" eventKey='1'>Customers</RRB.MenuItemLink>
          <RRB.MenuItemLink to="contactPersonList" eventKey='2'>Contact persons</RRB.MenuItemLink>

          <MenuItem divider/>
          <MenuItem eventKey='3'>Administration</MenuItem>
        </DropdownButton>

        <DropdownButton eventKey={3} title='Invoice' onSelect={this.onSelect}>
          <RRB.MenuItemLink to="invoiceList" eventKey='1'>Invoices</RRB.MenuItemLink>

          <MenuItem divider/>
          <MenuItem eventKey='3'>Administration</MenuItem>
        </DropdownButton>


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

  onSelect = evt => {
    console.log('onSelect');
  }


}
