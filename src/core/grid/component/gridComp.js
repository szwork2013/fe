import React from 'react';
import ReactDOM from 'react-dom';
import reactMixin from 'react-mixin';
import {Router,Link} from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {debounce, last} from 'lodash';
import classNames from 'classnames';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, CollapsibleNav, Input} from 'react-bootstrap';
import {Checkbox, IconButton, FontIcon, Styles, FlatButton} from 'material-ui';

import Axios from 'core/common/config/axios-config';
import GridService from 'core/grid/gridService';

import VirtualList from 'core/components/virtualList/virtualList';
import {customizeTheme}  from 'core/common/config/mui-theme';
import Grid from 'core/grid/domain/grid';
import GridHeader from 'core/grid/component/gridHeader';
import {ZzIconButton} from 'core/components/toolmenu/toolmenu';


import css from 'core/grid/component/gridComp.less';

const Colors = Styles.Colors;

export default class GridComp extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
    muiTheme: React.PropTypes.object
  };


  static propTypes = {
    uiLocation: React.PropTypes.string.isRequired,
    grid: React.PropTypes.instanceOf(Grid).isRequired,
    onGridChange: React.PropTypes.func,
    updateGrid: React.PropTypes.func.isRequired,
    gridClassName: React.PropTypes.string,
    functionMap: React.PropTypes.object,
    multiSelect: React.PropTypes.bool,
    bodyStyle: React.PropTypes.object,
    hideToolbar: React.PropTypes.bool
  };

  static defaultProps = {
    multiSelect: true
  };


  constructor(props) {
    super(props);

    console.debug('GridComp#constructor, props: %o', props);

  }


  componentWillMount() {
    this.onResizeDebounced = debounce(this.onResize, 100);
  }

  componentDidMount() {
    console.debug('gridComp %s componentDidMount()', this.props.grid.gridLocation);

    // tohle je hack nutny kvuli zmene rozliseni > 1200 - vytrzeni gridu, tam i zpet
    if (this.refs.VirtualList) {
      this.refs.VirtualList.remountScroll(this.refs.rowContainer);
      this.props.updateGrid(this.props.grid);
      this.refs.VirtualList.forceUpdate();
    }
    window.addEventListener('resize', this.onResizeDebounced);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeDebounced);
  }


  /* *******   PRIVATE METHODS ************ */


  search(scrollToTop) {
    let grid = this.props.grid;
    if (!grid.activeGridConfig) {
      console.debug('GridComp#search(): activeGridConfig not set, ending for grid ' + grid.gridLocation);
      return;
    }

    if (grid.masterFields && grid.masterFields.length > 0 && !grid.masterId) {
      console.debug('GridComp#search(): masterId is not set, ending for grid ' + grid.gridLocation);
      return;
    }


    grid.selectedRows = new Map();
    grid.loading = true;
    grid.selectedAllRows = false;

    this.props.updateGrid(grid);


    //  this.dispatch(grid); // this dispatches the action
    GridService.search(grid)
      .then(grid => {
        grid.headerPaddingRight = this._computeNewHPR();
        if (scrollToTop && this.refs.VirtualList) {
          this.refs.VirtualList.scrollTop();
        }
        this.props.updateGrid(grid);
      }, (err) => {
        this.props.updateGrid(grid);
      });
  }

  _computeNewHPR() {
    let _cont = this.refs.rowContainer;
    if (!_cont) return null;
    return (_cont.scrollHeight > _cont.clientHeight) ? 15 : 0;
  }

  onResize = () => {
    let grid = this.props.grid;
    let newHPR = this._computeNewHPR();
    if (newHPR !== null && grid.headerPaddingRight !== newHPR) {
      grid.headerPaddingRight = newHPR;
      this.props.updateGrid(grid);
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
      grid.selectedAllRows = (clonedMap.size === this.props.grid.data.totalCount);
      grid.lastClickedRow = clickedRowId;
      this.props.updateGrid(grid);
    }
  };

  /* *******   EVENT HENDLERS ************ */


  onSelectGridConfig = (event, gc) => {
    console.log('onSelectGridConfig gridId = ' + gc.gridId);

    let grid = this.props.grid;
    grid.activeGridConfig = gc;
    grid.searchTerm = null;
    grid.sortArray = null;
    grid.conditionArray = null;
    grid.data = null;
    grid.widths = null;

    if (this.props.onGridChange) {
      this.props.onGridChange(grid);
    }

    this.search(true);
  };

  onSetDefault = (event, gridConfig) => {
    console.log('onSetDefault %O', gridConfig);

    let {grid, updateGrid} = this.props;

    GridService.setDefault(gridConfig.gridId)
    .then( response => {
      for(let gc of grid.gridConfigs) {
        gc.defaultGrid = undefined;
      }
      gridConfig.defaultGrid = true;
      updateGrid(grid);
    });
  };

  onSelectGridManage = (evt) => {
    evt.preventDefault();
    this.context.router.transitionTo('gridAdmin', {gridLocation: this.props.grid.gridLocation});
  };

  onSearchTermChange = evt => {
    let grid = this.props.grid;
    grid.searchTerm = evt.target.value;
    this.props.updateGrid(grid);
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

    let oldConditionIndex = grid.conditionArray.findIndex(gcc => gcc.columnName === mdField.fieldName);

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

    this.props.updateGrid(grid);

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

    this.props.updateGrid(grid);

    if (this.refs.VirtualList) {
      this.refs.VirtualList.forceUpdate();
    }
  };

  onAction = (functionName, cellId, index, evt) => {
    //console.debug("functionName %s ... %s ... %s ... %s", functionName, cellId, index, evt.target.checked);
    this.props.functionMap[functionName](cellId, index, evt.target.checked);
  };

  /* *******   REACT METHODS ************ */


  render() {
    let {
      grid,
      children,
      uiLocation,
      gridClassName,
      multiSelect,
      bodyStyle,
      hideToolbar
      } = this.props;

    console.debug("gridComp rendering: dataCount = " + grid.getTotalCount());


    let dropdownId = grid.gridLocation + "_dropdown";

    const gridClassNames = classNames('md-grid', 'md-grid--' + uiLocation, gridClassName);

    if (!grid.activeGridConfig) {
      return (
        <div className={gridClassNames}>
          <Navbar fluid style={{marginBottom: 10, minHeight: 'initial', fontSize: 14}}>
            <Nav>
              <NavItem eventKey={3} href={this.context.router.makeHref('gridAdmin', {gridLocation: grid.gridLocation})}
                       onClick={this.onSelectGridManage}>Create Grid</NavItem>
            </Nav>
          </Navbar>
        </div>
      )
    }



    // {/*<MenuItem eventKey={gc.gridId} key={gc.gridId} onSelect={this.onSelectGridConfig}> {gc.label} <span className="fa fa-bookmark"></span> </MenuItem>*/}

    let gridConfigMenu = (
      <NavDropdown id={dropdownId} eventKey={3} title={grid.activeGridConfig.label}>
        {
          grid.gridConfigs.map((gc, index) => {

            let routeName = last(this.context.router.getCurrentRoutes()).name;
            let routeDef = (uiLocation === 'page') ? this.context.router.makeHref(routeName, {gridId: gc.gridId}) : '';

            return (
              <GridSelectMenuItem eventKey={gc.gridId} key={gc.gridId} onSelect={this.onSelectGridConfig} onSetDefault={this.onSetDefault} route={routeDef} gc={gc} />
            );
          })
        }
        <MenuItem divider/>
        <MenuItem href={this.context.router.makeHref('gridAdmin', {gridLocation: grid.gridLocation})}
                  onSelect={this.onSelectGridManage}> Manage </MenuItem>
      </NavDropdown>
    );

    let loadingElement = (
      <div className="grid-comp--loading">
        <div><i className="fa fa-3x fa-refresh fa-spin"></i></div>
      </div>
    );

    this.columnWidths = grid.activeGridWidths;


    return (


      <div className={gridClassNames}>

        {(hideToolbar) ? '' : (
          <Navbar fluid style={{marginBottom: 10, minHeight: 'initial', fontSize: 14}}>
            <Nav navbar>
              {gridConfigMenu}
            </Nav>

            {(multiSelect) ? (
              <ZzIconButton tooltip="Show selection"
                            fontIcon={classNames('fa', {'fa-check-square': grid.showSelection, 'fa-check-square-o': !grid.showSelection})}
                            onClick={this.onClickCheck}/>
            ) : ''}
            <ZzIconButton tooltip="Refresh" fontIcon="fa fa-refresh" onClick={this.onClickRefresh}/>

            { (grid.data && grid.data.totalCount) ? (grid.data.totalCount + ' rows') : '' }

            {children}

            <form className="navbar-form navbar-right" role="search" onSubmit={this.onSearchTermSubmit}>
              <Input type="text" placeholder='Search' onChange={this.onSearchTermChange} value={grid.searchTerm}
                     bsSize="small"/>
            <span className="fa fa-search"
                  style={{position: 'absolute', bottom: 15, right: 15, pointerEvents: 'none', color: Colors.grey400}}></span>
            </form>
          </Navbar>
        )}


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

                  let sortObject = (grid.sortArray) ? grid.sortArray.find(so => so.field.fieldName === mdField.fieldName) : null;
                  let conditionObject = (grid.conditionArray) ? grid.conditionArray.find(gcc => gcc.$columnRef.fieldName === mdField.fieldName) : null;

                  return (
                    <div key={columnIndex} className="md-grid-header-cell"
                         style={{width: this.columnWidths[0][columnIndex]+'%', minWidth: this.columnWidths[1][columnIndex]+'px', maxWidth: this.columnWidths[2][columnIndex]+'px'}}>
                      <GridHeader field={mdField} sortObject={sortObject} conditionObject={conditionObject}
                                  gridConfig={grid.activeGridConfig} onClickLink={this.onClickColumnSort}
                                  onConditionSet={this.onClickColumnCondition}/>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>

        <div ref="rowContainer" className="md-grid-body" style={bodyStyle}>
          { (grid.loading) ? loadingElement : '' }
          {
            ( grid.data) ? (( grid.data.totalCount === 0) ? 'No data found'
                : ( (grid.data.totalCount > 50) ?
                (<VirtualList ref="VirtualList" items={ grid.data.rows} renderItem={this.renderItem}
                              itemHeight={28}
                              container={this.refs.rowContainer} scrollDelay={15} resizeDelay={15}
                              header={this.refs.gridHeader} useRAF={true}/> )
                : grid.data.rows.map((row, index) => this.renderItem(row, index)))
            ) : ''
          }
        </div>
      </div>
    );
  }


  renderItem = (item, index) => {
    let {grid, functionMap} = this.props;


    let activeGridConfig = grid.activeGridConfig;
    let rowClass = "md-grid-row";

    let selected = grid.selectedRows.has(item.rowId);
    if (selected) {
      rowClass += " md-grid-row-selected";
    }

    let showRowHover = activeGridConfig.showRowHower;
    if (showRowHover) {
      rowClass += " md-grid-row-hover";
    }

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
            item.cells.map((gridCell, columnIndex) => {

              let field = activeGridConfig.$columnRefs[columnIndex];
              let detailRoute = field.detailRoute;

              let formattedValue = field.formatValue(gridCell.value);

              let styleObject = {
                width: this.columnWidths[0][columnIndex] + '%',
                minWidth: this.columnWidths[1][columnIndex] + 'px',
                maxWidth: this.columnWidths[2][columnIndex] + 'px'
              };
              if (field.textAlign) {
                styleObject.textAlign = field.textAlign;
              }
              let cellId = (gridCell.dataId) ? gridCell.dataId : item.rowId;

              return (
                <div key={columnIndex} className="md-grid-cell"
                     style={styleObject}>
                  {
                    (field.displayType === 'BUTTON') ?
                      <FlatButton primary={true} style={{lineHeight: '28px'}} label={gridCell.value}
                                  labelPosition="after"
                                  onClick={this.onAction.bind(this, field.functionName, cellId, index)}/>
                      : ( (field.displayType === 'CHECKBOX') ?
                        <Checkbox name={field.fieldName}
                                  checked={functionMap[field.functionNameGetter()](cellId, index)}
                                  onCheck={this.onAction.bind(this, field.functionNameSetter(), cellId, index)}/>
                        :
                        (
                          (detailRoute) ?
                            (
                              <Link to={detailRoute} params={{id: cellId}}> {formattedValue} </Link>
                            )
                            : formattedValue
                        )
                    )
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


class GridSelectMenuItem extends React.Component {

  onClick = (evt) => {
    evt.preventDefault();
    this.props.onSelect(evt, this.props.gc);
  };

  onClick2 = (evt) => {
    evt.preventDefault();
    this.props.onSetDefault(evt, this.props.gc);
  };

  render() {
    let {gc, route} = this.props;

    return (
      <li style={{display: 'flex', justifyContent: 'space-between'}}>
        <a role="menuitem" tabIndex={-1} href={route} onClick={this.onClick} style={{flexGrow: 1}}>
          {gc.label}
        </a>
        <a href onClick={this.onClick2}><span className={classNames('fa', {'fa-bookmark': gc.defaultGrid, 'fa-bookmark-o': !gc.defaultGrid})}></span></a>
      </li>
    );
  }
}
