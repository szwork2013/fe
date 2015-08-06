import React from 'react';
import {Navbar, Nav, NavItem, DropdownButton, MenuItem, CollapsibleNav } from 'react-bootstrap';
import * as RRB from 'react-router-bootstrap';
import { State, Navigation  } from 'react-router';

export default class MainMenu extends React.Component {

  render() {
    return (
      <Navbar inverse fixedTop fluid brand={<a href="#">Zauzoo IS</a>} toggleNavKey={0}>
        <CollapsibleNav eventKey={0}>
          <Nav navbar>
            <RRB.NavItemLink to="home" eventKey={1}>Home</RRB.NavItemLink>
            <DropdownButton eventKey={2} title='Party' onSelect={this.onSelect}>
              <RRB.MenuItemLink to="partyList" eventKey='1' >Parties</RRB.MenuItemLink>
              <MenuItem divider />
              <MenuItem eventKey='2'>Separated link</MenuItem>
            </DropdownButton>
          </Nav>
          <Nav navbar right>
            <NavItem eventKey={1} href='#'>Link Right</NavItem>
            <NavItem eventKey={2} href='#'>Link Right</NavItem>
          </Nav>
        </CollapsibleNav>
      </Navbar>
    );
  }

  onSelect = evt => {
    console.log('onSelect');
  }



}

//var MainMenu = React.createClass({
//  mixins: [State, Navigation],
//
//  render: function () {
//    return (
//      <Navbar inverse fixedTop fluid brand={<a href="#">Zauzoo IS</a>} toggleNavKey={0}>
//        <CollapsibleNav eventKey={0}>
//          <Nav navbar>
//            <RRB.NavItemLink to="home" eventKey={1}>Home</RRB.NavItemLink>
//            <DropdownButton eventKey={2} title='Party'>
//              <MenuItem to="partyList" eventKey='1' href={this.makeHref('partyList')} active={this.isActive('partyList')}>Parties</MenuItem>
//              <MenuItem divider/>
//              <MenuItem eventKey='2'>Separated link</MenuItem>
//            </DropdownButton>
//          </Nav>
//          <Nav navbar right>
//            <NavItem eventKey={1} href='#'>Link Right</NavItem>
//            <NavItem eventKey={2} href='#'>Link Right</NavItem>
//          </Nav>
//        </CollapsibleNav>
//      </Navbar>
//    );
//  }
//
//
//});
//
//
//export default MainMenu;
//
