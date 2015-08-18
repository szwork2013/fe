import React from 'react';
import reactMixin from 'react-mixin';
import {Navbar, Nav, NavItem, DropdownButton, MenuItem, CollapsibleNav } from 'react-bootstrap';
import * as RRB from 'react-router-bootstrap';
import Router from 'react-router';

import SecurityService from 'core/security/securityService';
import CurrentUserActions from 'core/security/currentUserActions';


@reactMixin.decorate(Router.Navigation)
export default class MainMenu extends React.Component {

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

  render() {
    return (
      <Navbar inverse fixedTop fluid brand={<a href="#">Zauzoo IS</a>} toggleNavKey={0}>
        <CollapsibleNav eventKey={0}>
          <Nav navbar>
            <RRB.NavItemLink to="home" eventKey={1}>Home</RRB.NavItemLink>
            <DropdownButton eventKey={2} title='Party' onSelect={this.onSelect}>
              <RRB.MenuItemLink to="partyList" eventKey='1'>Parties</RRB.MenuItemLink>
              <MenuItem divider/>
              <MenuItem eventKey='2'>Separated link</MenuItem>
            </DropdownButton>
          </Nav>
          <Nav navbar right>
            <NavItem eventKey={1} href='#'>Link Right</NavItem>
            <NavItem eventKey={2} onClick={this.logout}>Logout</NavItem>
          </Nav>
        </CollapsibleNav>
      </Navbar>
    );
  }

  onSelect = evt => {
    console.log('onSelect');
  }


}
