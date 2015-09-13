import React from 'react';
import reactMixin from 'react-mixin';
import Router from 'react-router';
import connectToStores from 'alt/utils/connectToStores';
import _ from 'lodash';
import classNames from 'classnames';

import VirtualList from 'core/components/virtualList/virtualList';

import {Navbar, Nav, NavDropdown, MenuItem, CollapsibleNav, Input} from 'react-bootstrap';
import {Checkbox, FlatButton, IconButton, FontIcon} from 'material-ui';

import GridStore from 'core/grid/store/gridStore';
import GridActions from 'core/grid/action/gridActions';
import Grid from 'core/grid/domain/grid';
import GridHeader from 'core/grid/component/gridHeader';


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
    let sortArray = (props.connected && props.query && props.query.sort) ? props.query.searchTerm : '';

    this.state = {
      searchTerm: searchTerm,
      activeGridConfig: props.grid.getActiveGridConfig(props.gridId),
      loading: false,
      showSelection: false,
      sortArray: sortArray  // [{field: MdField, direction: ASC/DESC}, ....]
    }
  }

  componentWillReceiveProps(nextProps) {
    console.debug('componentWillReceiveProps nextProps: %o', nextProps);
    if (nextProps.connected) {
      let searchTerm = (nextProps.connected && nextProps.query && nextProps.query.searchTerm) ? nextProps.query.searchTerm : '';
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

    let sortTerms = this.state.sortArray.map(v => v.field.fieldName + '_' + v.direction);

    GridActions.fetchData(this.props.grid, this.state.activeGridConfig, this.state.searchTerm, sortTerms)
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
        searchTerm: '',
        sort: []
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
  };


  onClickCheck = (evt) => {
    console.log('onCheckSquare %o', evt);
    this.setState({showSelection: !this.state.showSelection});
    this.refs.VirtualList.forceUpdate();
  };

  onClickRefresh = (evt) => {
    console.log('onClickRefresh %o', evt);
    this.search();
  };

  onClickColumnSort(sortObject) {
    console.log('onClickColumnSort %o', sortObject);
    let sortArray = [sortObject];
    this.setState(sortArray);

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

  }


  /* *******   REACT METHODS ************ */


  render() {
    console.debug("gridComp rendering: " + Date.now());


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

    let iconbuttonStyle = {
      height: 40,
      width: 40
    };
    let iconStyle = {fontSize: 15};

    return (


      <div className="md-grid">

        <Navbar fluid style={{marginBottom: 10}}>
          <Nav navbar>
            {gridConfigMenu}
          </Nav>
          <IconButton onClick={this.onClickCheck} tooltip="Show selection" style={iconbuttonStyle} iconStyle={iconStyle}>
            <FontIcon className={classNames('fa', {'fa-check-square': this.state.showSelection, 'fa-check-square-o': !this.state.showSelection})} />
          </IconButton>
          <IconButton onClick={this.onClickRefresh} tooltip="Refresh" style={iconbuttonStyle} iconStyle={iconStyle}>
            <FontIcon className="fa fa-refresh" />
          </IconButton>

          { (_gridData && _gridData.totalCount) ? (_gridData.totalCount + ' rows') : '' }

          <form className="navbar-form navbar-right" role="search" onSubmit={this.onSearchTermSubmit}>
            <Input type="text" value={this.state.searchTerm} onChange={this.onSearchTermChange} placeholder='Search'
                   bsSize="small"/>
          </form>
        </Navbar>

        { (this.state.loading) ? loadingElement : '' }

          <div className="md-grid-header">

            {
              ( (this.state.showSelection) ? (
                <div className="md-grid-header-cell">
                  <Checkbox name="selectAllCheckbox"/>
                </div>
              ) : '')
            }


            {
              this.state.activeGridConfig.$columnRefs.map((mdField, columnIndex) => {
                return (
                  <div key={columnIndex} className="md-grid-header-cell"
                       style={{width: this.columnWidths[columnIndex]}}>
                    <GridHeader field={mdField} sortArray={this.state.sortArray} onClickLink={this.onClickColumnSort} />
                  </div>
                );
              })
            }
          </div>

          <div ref="rowContainer" className="md-grid-body">
            {
              ( _gridData) ? (( _gridData.totalCount === 0) ? 'No data found'
                  :
                  //this._tableRowsElement(_gridData.rows, columnWidths)) : ''
                  (<VirtualList ref="VirtualList" items={ _gridData.rows} renderItem={this.renderItem}
                                itemHeight={28}
                                container={this.container} scrollDelay={15} resizeDelay={100} /> )
              ) : ''
            }
          </div>

      </div>
    );
  }


  renderItem = (item) => {
    return (
      <div key={item.rowId} className="md-grid-row">

        {
          ( (this.state.showSelection) ? (
            <div className="md-grid-cell">
              <Checkbox name="selectRowCheckbox"/>
            </div>
          ) : '')
        }

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


