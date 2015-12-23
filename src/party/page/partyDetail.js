import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import History from 'react-router/lib/History';
import {uniq, values, first, last} from 'lodash';
import When from 'when';
import { connect } from 'react-redux';
import { FlatButton, Styles, Tabs, Tab} from 'material-ui';

import PageAncestor from 'core/common/page/pageAncestor';
import Toolmenu from 'core/components/toolmenu/toolmenu';
import {store} from 'core/common/redux/store';
import MdEntityService from 'core/metamodel/mdEntityService';
import PartyService from 'party/partyService';
import {setPartyAction} from 'party/partyActions';
import {customizeThemeForDetail, TabTemplate}  from 'core/common/config/mui-theme';
import {screenLg, tabStyle} from 'core/common/config/variables';

import {composedParty, CUSTOMER_ROLE} from 'party/partyUtils';
import PartyFoForm from 'party/component/partyFoForm';
import PartyPoForm from 'party/component/partyPoForm';
import PartyContactList from 'party/component/partyContactList';
import PartyRoleList from 'party/component/partyRoleList';
import PartyAddressList from 'party/component/partyAddressList';

import GridService from 'core/grid/gridService';
import Grid from 'core/grid/domain/grid';
import GridComp from 'core/grid/component/gridComp';
import {updateGridAction} from 'party/partyActions';


const vehicleGridLocation = 'partyVehicleList';
const invoiceGridLocation = 'partyInvoiceList';
const partyRelGridLocation = 'partyRelList';




function mapStateToProps(state) {
  let partyObject = state.getIn(['party', 'partyObject']);
  let $grids = partyObject.$grids;

  function select(gridLocation) {
    return ($grids[gridLocation]) ? $grids[gridLocation] : Grid.clone(state.getIn(['grid', 'grids', gridLocation]));
  }

  let grids = [select(partyRelGridLocation)];
  if (partyObject.hasRole(CUSTOMER_ROLE)) {
    grids.unshift(select(invoiceGridLocation));
    grids.unshift(select(vehicleGridLocation));
  }

  return {
    partyObject,
    entities: state.getIn(['metamodel', 'entities']),
    grids
  };
}




@connect(mapStateToProps, {setPartyAction, updateGridAction})
export default class PartyDetail extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  static title = 'Customer';
  static icon = 'user';

  static willTransitionTo = PageAncestor.willTransitionTo;
  static willTransitionFrom = PageAncestor.willTransitionFrom;



  static contextTypes = {
    router: React.PropTypes.func.isRequired,
    muiTheme: React.PropTypes.object
  };

  static fetchData(routerParams, query) {
    console.log("PartyDetail#fetchData()");

    let metadataPromise = MdEntityService.fetchEntityMetadata(['Party', 'PartyContact', 'PartyRole', 'Address'], ['PARTYCONTACTCATEGORY']);

    let partyPromise = ((routerParams.id === 'new') ? When(Object.assign({
      contacts: [],
      addresses: [],
      roles: [],
      $open: true
    }, query)) : PartyService.readParty(routerParams.id));

    let gridPromise = GridService.fetchGrids(vehicleGridLocation, invoiceGridLocation, partyRelGridLocation);

    return When.all([metadataPromise, partyPromise, gridPromise])
      .then( ([entityMap, partyObject, gridMap]) => {
        partyObject.$grids = {};
        partyObject = composedParty(partyObject, entityMap);
        return store.dispatch(setPartyAction(partyObject))
    });
  }

  state = {};


  mediaQueryListener = (changed) => {
    console.log('mediaQueryListener islarge = ' + changed.matches);
    if (!this.initPartyGrids()) {
      this.forceUpdate();
    }
    setTimeout( () => {
      this.searchPartyGrids();
    }, 0);
  };

  /**
   *
   */
  componentWillMount() {
    console.debug('partyDetail#componentWillMount, props: %o', this.props);

    customizeThemeForDetail(this.context.muiTheme);

    this.mediaQuery = window.matchMedia('only screen and (min-width: ' + screenLg + 'px)');
    this.mediaQuery.addListener(this.mediaQueryListener);

    this.initPartyGrids();
  }


  /**
   * tohle je tady kvuli prechodu na jiny detail party (z relationship vazeb), kdy react-router neudela reload
   * @param prevProps
   */
  componentDidUpdate(prevProps) {
    if (this.props.partyObject.partyId && this.props.partyObject.partyId !== prevProps.partyObject.partyId) {
      console.log("partyDetail#componentWillReceiveProps() - change of party, resetting grids");

      let {grids} = this.props;
      let selectedTab = (this.mediaQuery.matches && grids.length > 1) ? grids[1].gridLocation :  grids[0].gridLocation;

      this.setState({selectedTab});

      this.activateTab(first(grids));
      if(this.mediaQuery.matches && grids.length > 1) this.activateTab(grids[1]);

      setTimeout(() => {this.setState({selectedTab: undefined});});
    }
  }

  componentDidMount() {
    this.searchPartyGrids();
  }

  componentWillUnmount() {
    this.mediaQuery.removeListener(this.mediaQueryListener);
    this.props.setPartyAction(null);
  }

  initPartyGrids() {
    let {grids} = this.props;

    let updated = this.initGrid(first(grids));
    if(this.mediaQuery.matches && grids.length > 1) {
      updated = updated | this.initGrid(grids[1]);  // pozor bitwise, nechci shortcutting
    }
    return !!updated;
  }

  searchPartyGrids() {
    let {grids} = this.props;
    let firstGrid = first(grids);

    if (!firstGrid.data) this.refs[firstGrid.gridLocation].search();
    if(this.mediaQuery.matches && grids.length > 1 &&  !grids[1].data) {
      this.refs[grids[1].gridLocation].search();
    }
  }

  initGrid(grid) {
    console.log('initGrid %s', grid.gridLocation);
    let {partyObject, updateGridAction} = this.props;

    let doUpdate = false;
    if (!grid.activeGridConfig) {
      grid.activeGridConfig = grid.getActiveGridConfig();
      doUpdate = true;
    }
    if (grid.masterId !== partyObject.partyId) {
      grid.masterId = partyObject.partyId;
      doUpdate = true;
    }
    if (doUpdate) updateGridAction(grid);
    return doUpdate;
  }

  /**
   * Grid k aktivaci (init + search v timeoutu)
   * @param grid
   */
  activateTab(grid) {
    this.initGrid(grid);
    if (!grid.data) {
      setTimeout( () => {
        this.refs[grid.gridLocation].search();
      }, 0);
    }
  }



  onSave = (evt) => {
    console.log('onSave');
  };
  onDelete = (evt) => {
    console.log('onDelete');
  };
  onBack = (evt) => {
    console.log('onBack %O', this.context.router);
    this.context.router.goBack();
  };

  updateGrid = (grid) => {
    this.props.updateGridAction(grid);
  };



  render() {

    let {
      partyObject,
      entities,
      setPartyAction,
      grids
      } = this.props;

    let propsForCreateForm = {
      dataObject: partyObject,
      rootObject: partyObject,
      entity: entities.get('Party'),
      entities,
      setDataAction: setPartyAction
    };

    console.debug('%c partyDetail render $open = %s', 'background-color: yellow', partyObject.$open);

    const mainForm = (
      <form style={{marginTop: 10}}>
        <div className="row">
          <div className="col-xs-12 col-sm-8">
            { this._mainForm(partyObject, propsForCreateForm) }
            <PartyAddressList partyObject={partyObject} entities={entities} setPartyAction={setPartyAction}/>
          </div>
          <div className="col-xs-12 col-sm-4">
            <PartyContactList partyObject={partyObject} rootObject={partyObject} entities={entities} setDataAction={setPartyAction}/>
            <PartyRoleList partyObject={partyObject} rootObject={partyObject} entities={entities} setDataAction={setPartyAction}/>
          </div>
        </div>
      </form>
    );


    const tabArray = grids.slice( (this.mediaQuery.matches) ? 1 : 0 ).map(grid => (
      <Tab label={grid.label} style={tabStyle} onActive={this.activateTab.bind(this, grid)} key={grid.gridLocation}  value={grid.gridLocation}>
        {(partyObject.$grids[grid.gridLocation]) ?
          <GridComp ref={grid.gridLocation} grid={grid} uiLocation="tab" updateGrid={this.updateGrid}/>
          : ''}
      </Tab>
    ));


    const tabs = (tabArray.length) ? (
      <Tabs value={this.state.selectedTab} className="detail-grid" tabTemplate={TabTemplate} tabItemContainerStyle={tabStyle} contentContainerStyle={{width: '100%', flexGrow: 1, display: 'flex', minHeight: 0}} >
        {tabArray.map(t => t)}
      </Tabs>
    ) : '';

    if (this.mediaQuery.matches) {
      return (
        <main className="main-content" style={{display: 'flex', flexDirection: 'row', height: '100%'}} >
          <div style={{display: 'flex', flexDirection: 'column', height: '100%', flexBasis: '50%', flexShrink: 0}}>
            {this._createToolMenu(partyObject)}
            {mainForm}
            {tabs}
          </div>
          <GridComp ref={grids[0].gridLocation} grid={grids[0]} uiLocation="main" updateGrid={this.updateGrid}/>
        </main>
      );
    } else {
      return (
        <main className="main-content" style={{display: 'flex', flexDirection: 'column', height: '100%'}} >
          {this._createToolMenu(partyObject)}
          {mainForm}
          {tabs}
        </main>
      );
    }
  }



  _mainForm = (partyObject, propsForCreateForm) => {
    switch (partyObject.partyCategory) {
      case 'PO':
        return <PartyPoForm {...propsForCreateForm} />;
      case 'FO':
        return <PartyFoForm {...propsForCreateForm} />;
    }
  };


  _createToolMenu(partyObject) {
    return (
      <Toolmenu>
        <FlatButton onClick={this.onSave}>
          <span className="fa fa-save"/><span> Save customer</span>
        </FlatButton>
        { (partyObject.partyId > 0) ? (
          <FlatButton onClick={this.onDelete}>
            <span className="fa fa-trash"/><span> Delete Customer</span>
          </FlatButton>
        ) : <div/>}
        <FlatButton onClick={this.onBack} disabled={History.length <= 1}>
          <span className="fa fa-chevron-left"/><span> Back</span>
        </FlatButton>
      </Toolmenu>
    );
  }


}

