import React from 'react';
import reactMixin from 'react-mixin';
import Router from 'react-router';
import connectToStores from 'alt/utils/connectToStores';
import _ from 'lodash';
import classNames from 'classnames';

import VirtualList from 'core/components/virtualList/virtualList';

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
  };

  static defaultProps = {
    allRowsSelected: true,
    fixedFooter: true,
    fixedHeader: true,
    height: '700px',
    multiSelectable: true,
    selectable: true,
    deselectOnClickaway: true,
    showRowHover: true,
    stripedRows: false

  };

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
  };


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
    this.container = React.findDOMNode(this.refs.rowContainer);
  }

  componentWillUnmount() {
    console.debug('componentWillUnmount');
    let grid = this.props.grid;
    grid.data = null;
    grid.gridWidths = null;
    GridActions.updateGrid(grid);
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

  onSelectGridManage = (evt) => {
    evt.preventDefault();
    this.context.router.transitionTo('gridAdmin', {gridLocation: this.props.gridLocation})
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
    console.debug("gridComp rendering");


    var classes = classNames({
      'grid-comp--loading': this.state.loading
    });

    let dropdownId = this.props.gridLocation + "_dropdown";




    let gridConfigMenu = (
      (this.state.activeGridConfig) ?
        (
          <NavDropdown id={dropdownId} eventKey={3} title={this.state.activeGridConfig.label}>
            {
              this.props.grid.gridConfigs.map((gc) => {
                return (
                    <MenuItem eventKey={gc.gridId} key={gc.gridId} onSelect={this.onSelectGridConfig}>{gc.label}</MenuItem>
                );
              })
            }
            <MenuItem divider/>
            <MenuItem href={this.context.router.makeHref('gridAdmin', {gridLocation: this.props.gridLocation})} onSelect={this.onSelectGridManage}> Manage </MenuItem>
          </NavDropdown>
        )
        : (<span>No Grid Config defined</span>)

    );

    let loadingElement = (
      <div className="grid-comp--loading">
        <div><i className="fa fa-3x fa-refresh fa-spin"></i></div>
      </div>
    );

    this.columnWidths = (this.props.grid.gridWidths) ? this.props.grid.gridWidths : this.state.activeGridConfig.gridWidths;



    let _gridData = this.props.grid.data;



    return (


      <div className="md-grid-comp">

        <Navbar fluid style={{marginBottom: 10}}>
          <Nav navbar>
            {gridConfigMenu}
          </Nav>
          <form className="navbar-form navbar-right" role="search" onSubmit={this.onSearchTermSubmit}>
            <Input type="text" value={this.state.searchTerm} onChange={this.onSearchTermChange} placeholder='Search'
                   bsSize="small"/>
          </form>
        </Navbar>

        { (this.state.loading) ? loadingElement : '' }

        <div className="md-grid">

          <div className="md-grid-header">
            {
              this.state.activeGridConfig.$columnRefs.map((mdField, columnIndex) => {
                return (
                  <div key={columnIndex} className="md-grid-header-cell"
                       style={{width: this.columnWidths[columnIndex]}}>
                    {mdField.gridHeaderLabelActive}
                  </div>
                );
              })
            }
          </div>

          <div ref="rowContainer" className="md-grid-body">
            {
              ( this.props.grid.data) ? (( this.props.grid.data.totalCount === 0) ? 'No data found'
                  :
                  //this._tableRowsElement(_gridData.rows, columnWidths)) : ''
                  (<VirtualList items={ this.props.grid.data.rows} renderItem={this.renderItem} itemHeight={28}
                                container={this.container} scrollDelay={15}/> )
              ) : ''
            }
          </div>
          <div className="md-grid-footer">
            Ahoj
          </div>
        </div>


      </div>
    );
  }


  renderItem = (item) => {
    return (
      <div key={item.rowId} className="md-grid-row">
        {
          item.cells.map( (gridCell, columnIndex) => {

            return (
              <div key={columnIndex} className="md-grid-cell" style={{width: this.columnWidths[columnIndex] }} >
                {gridCell.value}
              </div>
            );
          })
        }
      </div>
    );
  }



}


