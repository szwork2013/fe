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
import {setPartyAction, updateGridAction} from 'party/partyActions';
import {customizeThemeForDetail, TabTemplate}  from 'core/common/config/mui-theme';
import {screenLg, tabStyle} from 'core/common/config/variables';
import {selectGrid, preSave} from 'core/form/formUtils';
import CommonService from 'core/common/service/commonService';

import {enhanceParty, CUSTOMER_ROLE} from 'party/partyUtils';
import PartyFoForm from 'party/component/partyFoForm';
import PartyPoForm from 'party/component/partyPoForm';
import PartyContactList from 'party/component/partyContactList';
import PartyRoleList from 'party/component/partyRoleList';
import PartyAddressList from 'party/component/partyAddressList';
import {ErrorComp} from 'core/components/errorComp/errorComp';


import GridService from 'core/grid/gridService';
import Grid from 'core/grid/domain/grid';
import GridComp from 'core/grid/component/gridComp';


const vehicleGridLocation = 'partyVehicleList';
const invoiceGridLocation = 'partyInvoiceList';
const partyRelGridLocation = 'partyRelList';


function mapStateToProps(state) {
  let entities = state.getIn(['metamodel', 'entities']);
  let partyObject = enhanceParty(state.getIn(['party', 'partyObject']), entities);


  let grids = [selectGrid(state, partyObject, partyRelGridLocation)];
  if (partyObject.hasRole(CUSTOMER_ROLE)) {
    grids.unshift(selectGrid(state, partyObject, invoiceGridLocation));
    grids.unshift(selectGrid(state, partyObject, vehicleGridLocation));
  }

  return {
    partyObject,
    entities,
    grids
  };
}

var $freshLoadFlag = false;


@connect(mapStateToProps, {setPartyAction, updateGridAction})
export default class PartyDetail extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  static title = 'Customer';
  static icon = 'male';

  static willTransitionTo = PageAncestor.willTransitionTo;
  static willTransitionFrom = PageAncestor.willTransitionFrom;



  static contextTypes = {
    router: React.PropTypes.func.isRequired,
    muiTheme: React.PropTypes.object
  };

  static fetchData(routerParams, query) {
    console.log("PartyDetail#fetchData(%O)", query);
    $freshLoadFlag = true;


    let metadataPromise = MdEntityService.fetchEntityMetadata(['Party', 'PartyContact', 'PartyRole', 'Address'], [{entity: 'PARTYCONTACTCATEGORY', lov: true}]);

    let partyPromise;
    if (routerParams.id === 'new') {
      let q = Object.assign({}, query);
      let roles = [];
      if (q.roles != null) {
        roles.push({roleType: parseInt(q.roles)});
        delete q.roles;
      }
      partyPromise = Object.assign({
        contacts: [],
        addresses: [],
        roles: roles,
        $new: true
      }, q);
    } else {
      partyPromise = PartyService.readParty(routerParams.id);
    }

    let gridPromise = GridService.fetchGrids(vehicleGridLocation, invoiceGridLocation, partyRelGridLocation);

    return When.all([metadataPromise, partyPromise, gridPromise])
      .then( ([entityMap, partyObject, gridMap]) => {
        CommonService.loading(false);
        partyObject.$grids = {};
        partyObject.$loaded = true;
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
    console.debug("%c componentDidUpdate", "background-color: magenta");
    if ($freshLoadFlag) {
      $freshLoadFlag = false;
      console.log("partyDetail#componentDidUpdate() - change of party, resetting grids");

      let {grids} = this.props;
      let selectedTab = (this.mediaQuery.matches && grids.length > 1) ? grids[1].gridLocation :  grids[0].gridLocation;

      this.setState({selectedTab});

      this.activateTab(first(grids));
      if(this.mediaQuery.matches && grids.length > 1) this.activateTab(grids[1]);

      setTimeout(() => {this.setState({selectedTab: undefined});});
    }
  }

  componentDidMount() {
    console.debug("%c componentDidMount", "background-color: magenta");
    $freshLoadFlag = false;
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

  customValidate = (partyObject) => {
    let errors = [];
    if (partyObject.roles.length === 0) {
      errors.push({message: "Party must have at least one role"})
    }
    return errors;
  };



  onSave = (doReturn, evt) => {
    console.log('onSave ' + doReturn);
    let {partyObject, setPartyAction} = this.props;

    let result = preSave(partyObject, this.customValidate);
    if (!result) {
      setPartyAction(partyObject);
      return;
    }

    CommonService.loading(true);
    PartyService.partySave(partyObject)
    .then( (partyId) => {
      if(doReturn) {
        this.context.router.goBack();
        CommonService.loading(false);
      } else {
        if(partyObject.$new) {
          this.context.router.replaceWith('partyDetail', {id: partyId});
        } else {
          this.context.router.refresh();
        }
      }
      CommonService.toastSuccess("Party " + partyObject.fullName + " byl úspěšně uložen");
    });

  };


  onDelete = (evt) => {
    console.log('onDelete');
    let {partyObject, setPartyAction} = this.props;

    CommonService.loading(true);
    PartyService.deleteParty(partyObject.partyId)
    .then(response => {
      if (History.length <= 1) {
        this.context.router.transitionTo('home');
      } else {
        this.context.router.goBack();
      }
      CommonService.loading(false);
    }, error => {
      partyObject.$errors = error.data.messages;
      setPartyAction(partyObject, 'partyDetail#onDelete()');
    });
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

    console.debug('%c partyDetail render', 'background-color: yellow');

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
            <ErrorComp messages={partyObject.$errors} />
            {mainForm}
            {tabs}
          </div>
          <GridComp ref={grids[0].gridLocation} grid={grids[0]} uiLocation="main-right" updateGrid={this.updateGrid}/>
        </main>
      );
    } else {
      return (
        <main className="main-content" style={{display: 'flex', flexDirection: 'column', height: '100%'}} >
          {this._createToolMenu(partyObject)}
          <ErrorComp messages={partyObject.$errors} />
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
        <FlatButton onClick={this.onSave.bind(this, false)}>
          <span className="fa fa-save"/><span> Save</span>
        </FlatButton>
        <FlatButton onClick={this.onSave.bind(this, true)} disabled={History.length <= 1}>
          <span className="fa fa-save"/><span> Save and return</span>
        </FlatButton>
        { (partyObject.partyId > 0) ? (
          <FlatButton onClick={this.onDelete}>
            <span className="fa fa-trash"/><span> Delete Customer</span>
          </FlatButton>
        ) : <noscript/>}
        <FlatButton onClick={this.onBack} disabled={History.length <= 1}>
          <span className="fa fa-chevron-left"/><span> Back</span>
        </FlatButton>
      </Toolmenu>
    );
  }


}

