import React from 'react';
import reactMixin from 'react-mixin';
import Router from 'react-router';
import connectToStores from 'alt/utils/connectToStores';
import _ from 'lodash';
import classNames from 'classnames';

import {Navbar, Nav, NavDropdown, MenuItem, CollapsibleNav, Input} from 'react-bootstrap';

import GridStore from 'core/grid/store/gridStore';
import GridActions from 'core/grid/action/gridActions';
import Grid from 'core/grid/domain/grid';

import Table from 'core/table/table';
import TableBody from 'core/table/table-body';
import TableHeader from 'core/table/table-header';
import TableRow from 'core/table/table-row';
import TableHeaderColumn from 'core/table/table-header-column';
import TableRowColumn from 'core/table/table-row-column';

import styles from 'core/grid/component/gridComp.less';


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
      activeGridConfig: props.grid.getActiveGridConfig(props.gridId),
      loading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    console.debug('componentWillReceiveProps nextProps: %o', nextProps);
    if (nextProps.connected) {
      let searchTerm = (nextProps.connected && nextProps.query && nextProps.query.searchTerm) ? nextProps.query.searchTerm : '';
      this.setState({
        searchTerm: searchTerm,
        activeGridConfig: (nextProps.gridId) ? nextProps.grid.getActiveGridConfig(nextProps.gridId) : this.state.activeGridConfig
      });
    }

  }

  componentWillMount() {
    console.debug('componentWillMount');
    this.search();
  }

  componentDidMount() {
    console.debug('componentDidMount');
  }

  /* *******   PRIVATE METHODS ************ */


  search() {
    console.debug("running search with gridId = %s, searchTerm = %s", this.state.activeGridConfig.gridId, this.state.searchTerm);
    this.setState({loading: true});

    GridActions.fetchData(this.props.grid, this.state.activeGridConfig, this.state.searchTerm)
      .then(() => {
        console.debug('search returned from server');
        this.setState({loading: false});
      });


  }


  /* *******   EVENT HENDLERS ************ */


  onSelectGridConfig = (event, gridId) => {
    console.log('onSelectGridConfig gridId = ' + gridId);

    if (this.props.connected) {
      var routeName = _.last(this.context.router.getCurrentRoutes()).name,
        params = this.context.router.getCurrentParams(),
        query = this.context.router.getCurrentQuery();

      params = Object.assign(params, {gridId});
      query = Object.assign(query, {
        searchTerm: ''
      });

      this.context.router.replaceWith(routeName, params, query);
    }

    let newAgc = this.props.grid.getGridConfig(gridId);
    this.setState({activeGridConfig: newAgc, searchTerm: ''}, () => {
      this.search();
    });

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
    }

    this.search();

  };

  onSearchTermChange = evt => {
    this.setState({searchTerm: evt.target.value});
  };

  _onRowSelection = (rows) => {
    console.log(rows);
  }


  /* *******   REACT METHODS ************ */

  render() {
    var classes = classNames({
      'grid-comp--loading': this.state.loading
    });


    let gridConfigMenu = (
      (this.state.activeGridConfig) ?
        (
          <NavDropdown eventKey={3} title={this.state.activeGridConfig.label}>
            {
              this.props.grid.gridConfigs.map((gc) => {
                return (
                    <MenuItem eventKey={gc.gridId} key={gc.gridId} onSelect={this.onSelectGridConfig}>{gc.label}</MenuItem>
                );
              })
            }
            <MenuItem divider/>
            <MenuItem>Manage</MenuItem>
          </NavDropdown>
        )
        : (<span>No Grid Config defined</span>)

    );

    let loadingElement = (
      <div className="grid-comp--loading">
        <div><i className="fa fa-3x fa-refresh fa-spin"></i></div>
      </div>
    );

    let tableHeaderRow = (
      <TableRow>
        {
          this.state.activeGridConfig.$columnRefs.map( (mdField) => {
            return (
              <TableHeaderColumn key={mdField.fieldName} tooltip={mdField.gridHeaderTooltipActive}>
                {mdField.gridHeaderLabelActive}
              </TableHeaderColumn>
            );
          })
        }
      </TableRow>
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

        { (this.state.loading) ? loadingElement : '' }


        <Table
          height={this.props.height}
          fixedHeader={this.props.fixedHeader}
          fixedFooter={this.props.fixedFooter}
          selectable={this.props.selectable}
          multiSelectable={this.props.multiSelectable}
          onRowSelection={this._onRowSelection}>
          <TableHeader enableSelectAll={this.props.enableSelectAll}>
            {tableHeaderRow}
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


