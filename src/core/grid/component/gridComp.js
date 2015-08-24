import React from 'react';
import reactMixin from 'react-mixin';
import Router from 'react-router';
import connectToStores from 'alt/utils/connectToStores';
import _ from 'lodash';

//import { Toolbar, ToolbarGroup, DropDownMenu, ToolbarTitle, TextField } from 'material-ui';
import {Navbar, Nav, NavItem, DropdownButton, MenuItem, CollapsibleNav, Input} from 'react-bootstrap';
import {NavItemLink, MenuItemLink} from 'react-router-bootstrap';

import GridStore from 'core/grid/store/gridStore';
import GridActions from 'core/grid/action/gridActions';
import Grid from 'core/grid/domain/grid';
import Table from 'core/table/table';
import TableBody from 'core/table/table-body';
import TableHeader from 'core/table/table-header';
import TableRow from 'core/table/table-row';
import TableHeaderColumn from 'core/table/table-header-column';
import TableRowColumn from 'core/table/table-row-column';


@connectToStores
export default class GridComp extends React.Component {

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  }

  static defaultProps = {
    allRowsSelected: true,
    fixedFooter: true,
    fixedHeader: true,
    height: '300px',
    multiSelectable: true,
    selectable: true,
    deselectOnClickaway: true,
    showRowHover: true,
    stripedRows: false

  }

  static propTypes = {
    gridLocation: React.PropTypes.string.isRequired,
    gridId: React.PropTypes.string,
    connected: React.PropTypes.bool,

    allRowsSelected: React.PropTypes.bool,
    fixedFooter: React.PropTypes.bool,
    fixedHeader: React.PropTypes.bool,
    height: React.PropTypes.string,
    multiSelectable: React.PropTypes.bool,
    selectable: React.PropTypes.bool,
    deselectOnClickaway: React.PropTypes.bool,
    showRowHover: React.PropTypes.bool,
    stripedRows: React.PropTypes.bool,

    // from store
    grid: React.PropTypes.instanceOf(Grid)
  }


  static getStores(props) {
    return [GridStore];
  }

  // multiple stores @see https://github.com/goatslacker/alt/issues/420
  static getPropsFromStores(props) {
    let grid = GridStore.getGrid(props.gridLocation);
    return {grid};
  }




  constructor(props) {
    super(props);

    console.debug('Grid#constructor, props: %o', props);

    let searchTerm = (props.connected && props.query && props.query.searchTerm) ? props.query.searchTerm : '';

    this.state = {
      searchTerm: searchTerm,
      activeGridConfig: props.grid.getActiveGridConfig(props.gridId)
    }
    this.search();
  }

  componentWillReceiveProps(nextProps) {
    console.debug('componentWillReceiveProps nextProps: %o', nextProps);
    if (nextProps.gridId) {
      let searchTerm = (nextProps.connected && nextProps.query && nextProps.query.searchTerm) ? nextProps.query.searchTerm : '';
      this.setState({
        searchTerm: searchTerm,
        activeGridConfig: nextProps.grid.getActiveGridConfig(nextProps.gridId)
      }, () => {
        this.search();
      });
    }

  }

  //componentWillUpdate(nextProps, nextState) {
  //  console.debug('componentWillUpdate nextProps: %o, nextState: %o', nextProps, nextState);
  //}
  //
  //componentWillMount() {
  //  console.debug('componentWillMount');
  //}
  //
  //componentDidMount() {
  //  console.debug('componentDidMount');
  //}

  /* *******   PRIVATE METHODS ************ */


  search() {
    console.debug("running search with gridId = %s, searchTerm = %s", this.state.activeGridConfig.gridId, this.state.searchTerm);

  }


  /* *******   EVENT HENDLERS ************ */


  onSelectGridConfig = evt => {
    console.log('onSelectGridConfig %o', evt);
    this.setState({activeGridConfig: evt}, () => {
      this.search();
    });
  };

  onSearchTermChange = evt => {
    this.setState({searchTerm: evt.target.value});
  };

  onSearchTermSubmit = evt => {
    evt.preventDefault();
    console.log('onSearchTermSubmit: %s', this.state.searchTerm);

    if (this.props.connected) {
      var routeName = _.last(this.context.router.getCurrentRoutes()).name,
        params = this.context.router.getCurrentParams(),
        query = this.context.router.getCurrentQuery();

      query = Object.assign({}, query, {
        searchTerm: this.state.searchTerm
      });

      this.context.router.replaceWith(routeName, params, query);
    } else {
      this.search();
    }

  };

  onSearchTermChange = evt => {
    console.log('onSearchTermSubmit: %s', this.state.searchTerm);
  };

  _onRowSelection = (rows) => {
    console.log(rows);
  }


  /* *******   REACT METHODS ************ */

  render() {
    var routeName = _.last(this.context.router.getCurrentRoutes()).name;

    let gridConfigMenu = (
      (this.state.activeGridConfig) ?
        (
          <DropdownButton eventKey={3} title={this.state.activeGridConfig.label}>
            {
              this.props.grid.gridConfigs.map((gc) => {
                return (
                  (this.props.connected) ?
                    <MenuItemLink to={routeName} params={{ gridId: gc.gridId }} key={gc.gridId}>{gc.label}</MenuItemLink>
                    :
                    <MenuItem eventKey={gc} key={gc.gridId} onSelect={this.onSelectGridConfig}>{gc.label}</MenuItem>
                );
              })
            }
            <MenuItem divider/>
            <MenuItem>Manage</MenuItem>
          </DropdownButton>
        )
        : (<span>No Grid Config defined</span>)

    );


    return (


      <div>

        <Navbar fluid toggleNavKey={0}>
          <Nav navbar>
            {gridConfigMenu}
          </Nav>
          <form className="navbar-form navbar-right" role="search" onSubmit={this.onSearchTermSubmit}>
            <Input type="text" value={this.state.searchTerm} onChange={this.onSearchTermChange} placeholder='Search'
                   bsSize="small"/>
          </form>
        </Navbar>

        <Table
          height={this.props.height}
          fixedHeader={this.props.fixedHeader}
          fixedFooter={this.props.fixedFooter}
          selectable={this.props.selectable}
          multiSelectable={this.props.multiSelectable}
          onRowSelection={this._onRowSelection}>
          <TableHeader enableSelectAll={this.props.enableSelectAll}>
            <TableRow>
              <TableHeaderColumn tooltip='The ID'>ID</TableHeaderColumn>
              <TableHeaderColumn tooltip='The Name'>Name</TableHeaderColumn>
              <TableHeaderColumn tooltip='The Status'>Status</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            deselectOnClickaway={this.props.deselectOnClickaway}
            showRowHover={this.props.showRowHover}
            stripedRows={this.props.stripedRows}>
            <TableRow selected={true}>
              <TableRowColumn>1</TableRowColumn>
              <TableRowColumn>John Smith</TableRowColumn>
              <TableRowColumn>Employed</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>2</TableRowColumn>
              <TableRowColumn>Randal White</TableRowColumn>
              <TableRowColumn>Unemployed</TableRowColumn>
            </TableRow>
            <TableRow selected={true}>
              <TableRowColumn>3</TableRowColumn>
              <TableRowColumn>Stephanie Sanders</TableRowColumn>
              <TableRowColumn>Employed</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>4</TableRowColumn>
              <TableRowColumn>Steve Brown</TableRowColumn>
              <TableRowColumn>Employed</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>5</TableRowColumn>
              <TableRowColumn>Joyce Whitten</TableRowColumn>
              <TableRowColumn>Employed</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>6</TableRowColumn>
              <TableRowColumn>Samuel Roberts</TableRowColumn>
              <TableRowColumn>Unemployed</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>7</TableRowColumn>
              <TableRowColumn>Adam Moore</TableRowColumn>
              <TableRowColumn>Employed</TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>


      </div>
    );
  }


}


