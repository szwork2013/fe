import React from 'react';
import ReactDOM from 'react-dom';
import reactMixin from 'react-mixin';
import {Router,Link} from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import _ from 'lodash';
import classNames from 'classnames';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, CollapsibleNav, Input} from 'react-bootstrap';
import {Checkbox, IconButton, FontIcon, Styles} from 'material-ui';

import Axios from 'core/common/config/axios-config';
import {store} from 'core/common/redux/store';
import {updateGridAction} from 'core/grid/gridActions';
import GridService from 'core/grid/gridService';

import VirtualList from 'core/components/virtualList/virtualList';
import {customizeTheme}  from 'core/common/config/mui-theme';
import Grid from 'core/grid/domain/grid';
import GridHeader from 'core/grid/component/gridHeader';
import {ZzIconButton} from 'core/components/toolmenu/toolmenu';


import styles from 'core/grid/component/gridComp.less';


export default class GridComp extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
    muiTheme: React.PropTypes.object
  };


  static propTypes = {
    uiLocation: React.PropTypes.string.isRequired,

    // from store
    grid: React.PropTypes.instanceOf(Grid),
    onGridChange: React.PropTypes.func
  };



  constructor(props) {
    super(props);

    console.debug('GridComp#constructor, props: %o', props);

  }

  componentWillReceiveProps(nextProps) {
    console.debug('GridComp#componentWillReceiveProps, dataCount = ' +  nextProps.grid.getTotalCount());
  }

  componentWillMount() {
    customizeTheme(this.context.muiTheme, {
      flatButton: {
        color: Styles.Colors.blueGrey50
      }
    });

    this.onResizeDebounced = _.debounce(this.onResize, 100);
  }

  componentDidMount() {
    console.debug('gridComp#componentDidMount()');
    window.addEventListener('resize', this.onResizeDebounced);
    this.search();
  }

  componentWillUnmount() {
    console.debug('componentWillUnmount');
    window.removeEventListener('resize', this.onResizeDebounced);

    let grid = this.props.grid;
    grid.reset();
    store.dispatch(updateGridAction(grid));
  }


  /* *******   PRIVATE METHODS ************ */


  search(scrollToTop) {
    let grid = this.props.grid;
    if (!grid.activeGridConfig) return;

    console.debug("%c running search with gridId = %s, searchTerm = %s, masterId = %s", "background-color: green", grid.activeGridConfig.gridId, grid.searchTerm, grid.masterId);

    grid.selectedRows = new Map();
    grid.loading = true;
    grid.selectedAllRows = false;

    store.dispatch(updateGridAction(grid));


    //  this.dispatch(grid); // this dispatches the action
    Axios.get('/core/grid/' + grid.activeGridConfig.gridId, {params: Object.assign({searchTerm: grid.searchTerm, sort: grid.sort, masterId: grid.masterId}, grid.getConditionQueryObject())})
      .then((response) => {
        grid.data = response.data;
        grid.gridWidths = GridService.computeGridWidths(grid.data, grid.activeGridConfig);
        grid.loading = false;

        console.debug('data received count = ' + grid.data.totalCount);
        if (scrollToTop && this.refs.VirtualList) {
          this.refs.VirtualList.scrollTop();
        }
        grid.headerPaddingRight = this._computeNewHPR();

        store.dispatch(updateGridAction(grid));
      }, (err) => {
        grid.loading = false;
        store.dispatch(updateGridAction(grid));
      });
  }

  _computeNewHPR() {
    let _cont = this.refs.rowContainer;
    return (_cont.scrollHeight > _cont.clientHeight) ? 15 : 0;
  }

  onResize = () => {
    let grid = this.props.grid;
    let newHPR = this._computeNewHPR();
    if (grid.headerPaddingRight !== newHPR) {
      grid.headerPaddingRight = newHPR;
      store.dispatch(updateGridAction(grid));
    }
  };

  processRowSelection = (clickedRowId, e) => {
    let grid = this.props.grid;
    console.debug("processRowSelection: %o", clickedRowId);
    // provedeme pouze pokud je zapnuto oznacovani radku
    if (grid.showSelection) {
      // odstranime vsechny oznaceni
      window.getSelection().removeAllRanges();
      // zkopirujeme si mapu oznacenych radku
      let clonedMap = new Map(grid.selectedRows);
      let lastSelected = grid.lastClickedRow;

      if (clonedMap.has(clickedRowId)) {
        // pokud jsme klikli na oznaceny radek, odebereme ho z oznaceni
        clonedMap.delete(clickedRowId);
      } else {
        // pokud jsme klikli na neoznaceny radek, pridame ho do oznaceni
        clonedMap.set(clickedRowId, true);
      }

      // pokud byl pri kliknuti drzen shift a zaroven existoval klik predtim
      // a zaroven se nekliklo na jeden a ten samy radek
      if (e.shiftKey && lastSelected && lastSelected !== clickedRowId) {
          let startStop = false;
          // Projedeme vsechny radky
          this.props.grid.data.rows.every(row => {
            // pokud jsme nasli zacatek nebo konec oznaceni
            if (row.rowId === clickedRowId || row.rowId === lastSelected) {
              // pokud jsme narazili na zacatek oznaceni - nastavime startStop na true
              // zastaveni cylku pokud jsme na konci oznaceni (startStop == false)
              return startStop = !startStop;
            } else if (startStop) {
              // pokud jsme uprostred oznaceneho bloku - invertujeme oznaceni radku
              clonedMap.has(row.rowId) ? clonedMap.delete(row.rowId) : clonedMap.set(row.rowId, true);
            }
            // true, aby cyklus pokracoval dal
            return true;
          });
      }
      // nastavime stav
      grid.selectedRows = clonedMap;
      grid.selectedAllRows = (clonedMap.size ===  this.props.grid.data.totalCount);
      grid.lastClickedRow = clickedRowId;
      store.dispatch(updateGridAction(grid));
    }
  };

  /* *******   EVENT HENDLERS ************ */


  onSelectGridConfig = (event, gridId) => {
    console.log('onSelectGridConfig gridId = ' + gridId);

    let grid = this.props.grid;
    grid.activeGridConfig = this.props.grid.getGridConfig(gridId);
    grid.searchTerm = null;
    grid.sortArray = null;
    grid.conditionArray = null;

    if (this.props.onGridChange) {
      this.props.onGridChange(grid);
    }

    this.search(true);
  };

  onSelectGridManage = (evt) => {
    evt.preventDefault();
    this.context.router.transitionTo('gridAdmin', {gridLocation: this.props.grid.gridLocation});
  };

  onSearchTermChange = evt => {
    let grid = this.props.grid;
    grid.searchTerm = evt.target.value;
    store.dispatch(updateGridAction(grid));
  };

  onSearchTermSubmit = evt => {
    evt.preventDefault();
    let grid = this.props.grid;
    console.log('onSearchTermSubmit: %s', grid.searchTerm);

    if (this.props.onGridChange) {
      this.props.onGridChange(grid);
    }

    this.search(true);
  };


  onClickColumnSort = (sortObject) => {
    console.log('onClickColumnSort %o', sortObject);

    let grid = this.props.grid;
    grid.sortArray = [sortObject];

    if (this.props.onGridChange) {
      this.props.onGridChange(grid);
    }

    this.search(true);

  };

  onClickColumnCondition = (condition, mdField) => {
    console.log('onClickColumnCondition %o on %o', condition, mdField);

    let grid = this.props.grid;

    if (!grid.conditionArray) grid.conditionArray = [];

    let oldConditionIndex = _.findIndex(grid.conditionArray, (gcc => gcc.columnName === mdField.fieldName));

    if (condition) {
      if (oldConditionIndex >= 0) {
        grid.conditionArray.splice(oldConditionIndex, 1, condition);
      } else {
        grid.conditionArray.push(condition);
      }
    } else {
      if (oldConditionIndex >= 0) {
        grid.conditionArray.splice(oldConditionIndex, 1);
      }
    }


    if (this.props.onGridChange) {
      this.props.onGridChange(grid);
    }

    this.search(true);

  };




  onClickCheck = (evt) => {
    console.log('onCheckSquare %o', evt);
    let grid = this.props.grid;

    grid.selectedRows = new Map();
    grid.selectedAllRows = false;
    grid.showSelection = !grid.showSelection;

    store.dispatch(updateGridAction(grid));

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
  };

  onCheckCbxAll = (e) => {
    let grid = this.props.grid;

    if (grid.selectedRows.size !== grid.data.totalCount) {
      let keyValues = grid.data.rows.map(row => {
        return [row.rowId, true];
      });
      grid.selectedRows = new Map(keyValues);
      grid.selectedAllRows = true;
    } else {
      grid.selectedRows = new Map();
      grid.selectedAllRows = false;
    }

    store.dispatch(updateGridAction(grid));

    if (this.refs.VirtualList) {
      this.refs.VirtualList.forceUpdate();
    }
  };

  /* *******   REACT METHODS ************ */


  render() {
    let {
      grid,
      children,
      uiLocation
      } = this.props;

    console.debug("gridComp rendering: dataCount = " + grid.getTotalCount());


    let dropdownId = grid.gridLocation + "_dropdown";


    if (!grid.activeGridConfig) {
      return (
        <div className={classNames('md-grid', 'md-grid--' + uiLocation)} className="md-grid">
          <Navbar fluid style={{marginBottom: 10, minHeight: 'initial', fontSize: 14}}>
            <Nav>
              <NavItem eventKey={3} href={this.context.router.makeHref('gridAdmin', {gridLocation: grid.gridLocation})} onClick={this.onSelectGridManage}>Create Grid</NavItem>
            </Nav>
          </Navbar>
        </div>
      )
    }

    let gridConfigMenu = (
          <NavDropdown id={dropdownId} eventKey={3} title={grid.activeGridConfig.label}>
            {
              grid.gridConfigs.map((gc) => {
                return (
                    <MenuItem eventKey={gc.gridId} key={gc.gridId} onSelect={this.onSelectGridConfig}>{gc.label}</MenuItem>
                );
              })
            }
            <MenuItem divider/>
            <MenuItem href={this.context.router.makeHref('gridAdmin', {gridLocation: grid.gridLocation})} onSelect={this.onSelectGridManage}> Manage </MenuItem>
          </NavDropdown>
    );

    let loadingElement = (
      <div className="grid-comp--loading">
        <div><i className="fa fa-3x fa-refresh fa-spin"></i></div>
      </div>
    );

    this.columnWidths = grid.activeGridWidths;




    return (


      <div className={classNames('md-grid', 'md-grid--' + uiLocation)}>

        <Navbar fluid  style={{marginBottom: 10, minHeight: 'initial', fontSize: 14}}>
          <Nav navbar>
            {gridConfigMenu}
          </Nav>
          <ZzIconButton tooltip="Show selection" fontIcon={classNames('fa', {'fa-check-square': grid.showSelection, 'fa-check-square-o': !grid.showSelection})}
                        onClick={this.onClickCheck} />
          <ZzIconButton tooltip="Refresh" fontIcon="fa fa-refresh" onClick={this.onClickRefresh} />

          { (grid.data && grid.data.totalCount) ? (grid.data.totalCount + ' rows') : '' }

          {children}

          <form className="navbar-form navbar-right" role="search" onSubmit={this.onSearchTermSubmit}>
            <Input type="text"  placeholder='Search' onChange={this.onSearchTermChange} value={grid.searchTerm}
                   bsSize="small"/>
          </form>
        </Navbar>

        { (grid.loading) ? loadingElement : '' }
          <div className="md-grid-header-wrapper" style={{paddingRight: grid.headerPaddingRight}}>
            <div className="md-grid-header" ref="gridHeader">

              {
                ( (grid.showSelection) ? (
                  <div className="md-grid-header-cell" style={{float: 'left', minWidth: '28px', width: '28px'}}>
                    <Checkbox name="selectAllCheckbox"
                      onCheck={this.onCheckCbxAll}
                      checked={grid.selectedAllRows}
                    />
                  </div>
                ) : '')
              }

              <div className="md-grid-data-row" style={{marginRight: grid.showSelection?'28px':'0px'}}>
              {
                grid.activeGridConfig.$columnRefs.map((mdField, columnIndex) => {

                  let sortObject = _.find(grid.sortArray, so => so.field.fieldName === mdField.fieldName);
                  let conditionObject = _.find(grid.conditionArray, gcc => gcc.$columnRef.fieldName === mdField.fieldName);

                  return (
                    <div key={columnIndex} className="md-grid-header-cell"
                         style={{width: this.columnWidths[0][columnIndex]+'%', minWidth: this.columnWidths[1][columnIndex]+'px', maxWidth: this.columnWidths[2][columnIndex]+'px'}}>
                      <GridHeader field={mdField} sortObject={sortObject} conditionObject={conditionObject} gridConfig={grid.activeGridConfig} onClickLink={this.onClickColumnSort} onConditionSet={this.onClickColumnCondition} />
                    </div>
                  );
                })
              }
              </div>
            </div>
          </div>

          <div ref="rowContainer" className="md-grid-body">
            {
              ( grid.data) ? (( grid.data.totalCount === 0) ? 'No data found'
                  :
                  (<VirtualList ref="VirtualList" items={ grid.data.rows} renderItem={this.renderItem}
                                itemHeight={28}
                                container={this.refs.rowContainer} scrollDelay={15} resizeDelay={15} header={this.refs.gridHeader} useRAF={true} /> )
              ) : ''
            }
          </div>
      </div>
    );
  }


  renderItem = (item) => {
    let grid = this.props.grid;
    let activeGridConfig = grid.activeGridConfig;
    let rowClass = "md-grid-row";

    let selected = grid.selectedRows.has(item.rowId);
    if (selected) {rowClass += " md-grid-row-selected";}

    let showRowHover = activeGridConfig.showRowHower;
    if (showRowHover) {rowClass += " md-grid-row-hover";}

    return (
      <div key={item.rowId} className={rowClass}>
        {
          ( (grid.showSelection) ? (
            <div className="md-grid-cell" style={{float: 'left', minWidth: '28px', width: '28px'}}>
              <Checkbox
                  name="selectRowCheckbox"
                  checked={selected}
                  onClick={this.onClickRow.bind(this, item.rowId)}
                  />
            </div>
          ) : '')
        }

        <div className="md-grid-data-row" style={{marginRight: grid.showSelection?'28px':'0px'}}>
        {
          item.cells.map( (gridCell, columnIndex) => {

            let field = activeGridConfig.$columnRefs[columnIndex];
            let detailRoute = field.detailRoute;

            let formattedValue = field.formatValue(gridCell.value);

            let styleObject = {width: this.columnWidths[0][columnIndex]+'%', minWidth: this.columnWidths[1][columnIndex]+'px', maxWidth: this.columnWidths[2][columnIndex]+'px' };
            if (field.textAlign) {
              styleObject.textAlign = field.textAlign;
            }

            return (
              <div key={columnIndex} className="md-grid-cell"
                style={styleObject} >

                {
                  (detailRoute) ?
                    (
                      <Link to={detailRoute} params={{id: (gridCell.dataId) ? gridCell.dataId : item.rowId}}> {formattedValue} </Link>
                    )
                    : formattedValue
                }

              </div>
            );
          })
        }
        </div>
      </div>
    );
  }



}


