import React from 'react';
import reactMixin from 'react-mixin';
import {Router, Link} from 'react-router';
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

  };

  static propTypes = {
    gridLocation: React.PropTypes.string.isRequired,

    // from store
    grid: React.PropTypes.instanceOf(Grid),
    onGridChange: React.PropTypes.func
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

    console.debug('GridComp#constructor, props: %o', props);

    this.state = {
      loading: false,
      showSelection: false,
      selectedRows: new Map(),
      selectedAllRows: false,
      searchTerm: undefined,
      headerPaddingRight: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
    console.debug('componentWillReceiveProps oldProps: %o, nextProps: %o', this.props, nextProps);
    this.setState({
      loading: false,
      searchTerm: nextProps.grid.searchTerm
    });
  }


  componentWillMount() {
    console.debug('componentWillMount');
    this.onResizeDebounced = _.debounce(this.onResize, 100);
    this.search();
  }

  componentDidMount() {
    console.debug('componentDidMount');
    this.container = React.findDOMNode(this.refs.rowContainer);
    this.gridHeader = React.findDOMNode(this.refs.gridHeader);
    window.addEventListener('resize', this.onResizeDebounced);
  }

  componentWillUnmount() {
    console.debug('componentWillUnmount');
    window.removeEventListener('resize', this.onResizeDebounced);

    let grid = this.props.grid;
    grid.reset();
    GridActions.updateGrid(grid);
  }


  /* *******   PRIVATE METHODS ************ */


  search() {
    let grid = this.props.grid;
    console.debug("running search with gridId = %s, searchTerm = %s", grid.activeGridConfig.gridId, grid.searchTerm);
    this.setState({loading: true});
    this.state.selectedRows.clear();
    GridActions.fetchData(grid)
      .then(() => {
        console.debug('data received');
        this.onResize();
      }, () => {
        this.setState({loading: false});
      });
  }

  onResize = () => {
    let _cont = this.container;
    let oldHPR = this.state.headerPaddingRight;
    let newHPR = (_cont.scrollHeight > _cont.clientHeight) ? 15 : 0;
    if (oldHPR !== newHPR) {
      this.setState({
        headerPaddingRight: (_cont.scrollHeight > _cont.clientHeight) ? 15 : 0
      });
    }
  };

  processRowSelection = (rowId, e) => {
    console.debug("processRowSelection: %o", rowId);
    if (this.state.showSelection) {
      window.getSelection().removeAllRanges();
      if (e.shiftKey && this.state.selectedRows.size > 0) {
        let lastSelected = Array.from(this.state.selectedRows.keys())[this.state.selectedRows.size-1];
        if (lastSelected !== rowId) {
          let startStop = false;
          this.props.grid.data.rows.every(row => {
            if (row.rowId === rowId || row.rowId === lastSelected) {
              startStop = !startStop;
              this.state.selectedRows.set(row.rowId, true);
              if (!startStop) {return false;}
            } else if (startStop) {
              this.state.selectedRows.set(row.rowId, true);
            }
            return true;
          });
        }
      } else if (this.state.selectedRows.has(rowId)) {
        this.state.selectedRows.delete(rowId);
      } else {
        this.state.selectedRows.set(rowId, true);
      }
      this.setState({selectedAllRows: (this.state.selectedRows.size ===  this.props.grid.data.totalCount)});
    }
  };

  /* *******   EVENT HENDLERS ************ */


  onSelectGridConfig = (event, gridId) => {
    console.log('onSelectGridConfig gridId = ' + gridId);

    let grid = this.props.grid;
    grid.activeGridConfig = this.props.grid.getGridConfig(gridId);
    grid.searchTerm = null;
    grid.sortArray = null;

    if (this.props.onGridChange) {
      this.props.onGridChange(grid);
    }

    this.search();
  };

  onSelectGridManage = (evt) => {
    evt.preventDefault();
    this.context.router.transitionTo('gridAdmin', {gridLocation: this.props.gridLocation});
  };

  onSearchTermChange = evt => {
    this.setState({searchTerm: evt.target.value});
  };

  onSearchTermSubmit = evt => {
    evt.preventDefault();
    console.log('onSearchTermSubmit: %s', this.state.searchTerm);

    let grid = this.props.grid;
    grid.searchTerm = this.state.searchTerm;

    if (this.props.onGridChange) {
      this.props.onGridChange(grid);
    }

    this.search();
  };


  onClickColumnSort = (sortObject) => {
    console.log('onClickColumnSort %o', sortObject);

    let grid = this.props.grid;
    grid.sortArray = [sortObject];

    if (this.props.onGridChange) {
      this.props.onGridChange(grid);
    }

    this.search();

  }


  onClickCheck = (evt) => {
    console.log('onCheckSquare %o', evt);
    this.setState({showSelection: !this.state.showSelection});
    this.state.selectedRows.clear();

    if (this.refs.VirtualList) {
      this.refs.VirtualList.forceUpdate();
    }
  };

  onClickRefresh = (evt) => {
    console.log('onClickRefresh %o', evt);
    this.search();
  };

  onClickRow = (rowId, e) => {
    this.processRowSelection(rowId, e);

    if (this.refs.VirtualList) {
      this.refs.VirtualList.forceUpdate();
    }
  }

  onCheckCbxAll = (e) => {
    if (this.state.selectedRows.size !== this.props.grid.data.totalCount) {
      let keyValues = this.props.grid.data.rows.map(row => {
        return [row.rowId, true];
      });
      Object.assign(this.state.selectedRows, new Map(keyValues));
    } else {
      this.state.selectedRows.clear();
    }
    this.setState({selectedAllRows: (this.state.selectedRows.size ===  this.props.grid.data.totalCount)});
    if (this.refs.VirtualList) {
      this.refs.VirtualList.forceUpdate();
    }
  }

  /* *******   REACT METHODS ************ */


  render() {
    console.debug("gridComp rendering: " + Date.now());

    let grid = this.props.grid;

    var classes = classNames({
      'grid-comp--loading': this.state.loading
    });

    let dropdownId = this.props.gridLocation + "_dropdown";




    let gridConfigMenu = (
      (grid.activeGridConfig) ?
        (
          <NavDropdown id={dropdownId} eventKey={3} title={grid.activeGridConfig.label}>
            {
              grid.gridConfigs.map((gc) => {
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

    this.columnWidths = grid.activeGridWidths;



    let _gridData = grid.data;

    let iconbuttonStyle = {
      height: 40,
      width: 40
    };
    let iconStyle = {fontSize: 15};



    return (


      <div className="md-grid">

        <Navbar fluid style={{marginBottom: 10, minHeight: 'initial'}}>
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
            <Input type="text"  placeholder='Search' onChange={this.onSearchTermChange} value={this.state.searchTerm}
                   bsSize="small"/>
          </form>
        </Navbar>

        { (this.state.loading) ? loadingElement : '' }
          <div className="md-grid-header-wrapper" style={{paddingRight: this.state.headerPaddingRight}}>
            <div className="md-grid-header" ref="gridHeader">

              {
                ( (this.state.showSelection) ? (
                  <div className="md-grid-header-cell" style={{float: 'left', minWidth: '28px', width: '28px'}}>
                    <Checkbox name="selectAllCheckbox"
                      onCheck={this.onCheckCbxAll}
                      checked={this.state.selectedAllRows}
                    />
                  </div>
                ) : '')
              }

              <div className="md-grid-data-row" style={{marginRight: this.state.showSelection?'28px':'0px'}}>
              {
                grid.activeGridConfig.$columnRefs.map((mdField, columnIndex) => {
                  return (
                    <div key={columnIndex} className="md-grid-header-cell"
                         style={{width: this.columnWidths[0][columnIndex]+'%', minWidth: this.columnWidths[1][columnIndex]+'px', maxWidth: this.columnWidths[2][columnIndex]+'px'}}>
                      <GridHeader field={mdField} sortArray={grid.sortArray} onClickLink={this.onClickColumnSort} />
                    </div>
                  );
                })
              }
              </div>
            </div>
          </div>

          <div ref="rowContainer" className="md-grid-body">
            {
              ( _gridData) ? (( _gridData.totalCount === 0) ? 'No data found'
                  :
                  //this._tableRowsElement(_gridData.rows, columnWidths)) : ''
                  (<VirtualList ref="VirtualList" items={ _gridData.rows} renderItem={this.renderItem}
                                itemHeight={28}
                                container={this.container} scrollDelay={15} resizeDelay={15} header={this.gridHeader} useRAF={true} /> )
              ) : ''
            }
          </div>
      </div>
    );
  }


  renderItem = (item) => {
    let rowClass = "md-grid-row";

    let selected = this.state.selectedRows.has(item.rowId);
    if (selected) {rowClass += " md-grid-row-selected";}

    let showRowHover = this.props.grid.activeGridConfig.showRowHower;
    if (showRowHover) {rowClass += " md-grid-row-hover";}

    return (
      <div key={item.rowId} className={rowClass}>
        {
          ( (this.state.showSelection) ? (
            <div className="md-grid-cell" style={{float: 'left', minWidth: '28px', width: '28px'}}>
              <Checkbox
                  name="selectRowCheckbox"
                  checked={selected}
                  onClick={this.onClickRow.bind(this, item.rowId)}
                  />
            </div>
          ) : '')
        }

        <div className="md-grid-data-row" style={{marginRight: this.state.showSelection?'28px':'0px'}}>
        {
          item.cells.map( (gridCell, columnIndex) => {

            return (
              <div key={columnIndex} className="md-grid-cell"
                onClick={this.onClickRow.bind(this, item.rowId)}
                style={{width: this.columnWidths[0][columnIndex]+'%', minWidth: this.columnWidths[1][columnIndex]+'px', maxWidth: this.columnWidths[2][columnIndex]+'px' }} >
                {gridCell.value}
              </div>
            );
          })
        }
        </div>
      </div>
    );
  }



}


