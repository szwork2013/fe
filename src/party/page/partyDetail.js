import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import History from 'react-router/lib/History';
import {uniq, values} from 'lodash';
import When from 'when';
import { connect } from 'react-redux';
import { FlatButton, Styles, Tabs, Tab} from 'material-ui';

import PageAncestor from 'core/common/page/pageAncestor';
import Toolmenu from 'core/components/toolmenu/toolmenu';
import {store} from 'core/common/redux/store';
import MdEntityService from 'core/metamodel/mdEntityService';
import PartyService from 'party/partyService';
import {setPartyAction} from 'party/partyActions';
import {customizeTheme}  from 'core/common/config/mui-theme';
import {screenLg} from 'core/common/config/variables';

import PartyFoForm from 'party/component/partyFoForm';
import PartyPoForm from 'party/component/partyPoForm';
import PartyContactList from 'party/component/partyContactList';
import PartyRoleList from 'party/component/partyRoleList';
import PartyAddressList from 'party/component/partyAddressList';

import GridService from 'core/grid/gridService';
import Grid from 'core/grid/domain/grid';
import GridComp from 'core/grid/component/gridComp';
import {updateGridAction} from 'party/partyActions';

const Colors = Styles.Colors;
const Typography = Styles.Typography;

const vehicleGridLocation = 'partyVehicleList';
const invoiceGridLocation = 'partyInvoiceList';
const partyRelGridLocation = 'partyRelList';


function mapStateToProps(state) {
  let partyObject = state.getIn(['party', 'partyObject']);
  let $grids = partyObject.$grids;

  function select(gridLocation) {
    return ($grids[gridLocation]) ? $grids[gridLocation] : Grid.clone(state.getIn(['grid', 'grids', gridLocation]));
  }

  return {
    partyObject,
    entities: state.getIn(['metamodel', 'entities']),
    vehicleGrid: select(vehicleGridLocation),
    invoiceGrid: select(invoiceGridLocation),
    partyRelGrid: select(partyRelGridLocation)
  };
}


const TabTemplate = React.createClass({

  render() {
    let styles = {
      'width': '100%',
      minHeight: 0,
      flexGrow: 1
    };

    if (this.props.selected) {
      styles.display = 'flex';
    } else {
      styles.display = 'none';
    }

    return (
      <div style={styles}>
        {this.props.children}
      </div>
    );
  },
});


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
    }, query)) : PartyService.readParty(routerParams.id))
      .then(partyObject => {
        partyObject.$grids = {};
        return store.dispatch(setPartyAction(partyObject))
      });

    let gridPromise = GridService.fetchGrids(vehicleGridLocation, invoiceGridLocation, partyRelGridLocation);

    return When.all([metadataPromise, partyPromise, gridPromise]);
  }


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

    customizeTheme(this.context.muiTheme, {
      floatingActionButton: {
        /*  buttonSize: 56, */
        miniSize: 30
      },
      tabs: {
        backgroundColor: 'white',
        textColor: Typography.textLightBlack,
        selectedTextColor: Typography.textDarkBlack
      }
    });

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
      let {vehicleGrid, partyRelGrid} = this.props;
      this.activateTab(partyRelGrid);
      if(this.mediaQuery.matches) this.activateTab(vehicleGrid);
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
    let {vehicleGrid, invoiceGrid} = this.props;

    let updated = this.initGrid(vehicleGrid);
    if(this.mediaQuery.matches) {
      updated = updated | this.initGrid(invoiceGrid);  // pozor bitwise, nechci shortcutting
    }
    return !!updated;
  }

  searchPartyGrids() {
    let {vehicleGrid, invoiceGrid} = this.props;
    if (!vehicleGrid.data) this.refs[vehicleGridLocation].search();
    if(this.mediaQuery.matches && !invoiceGrid.data) {
      this.refs[invoiceGridLocation].search();
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


    const tabHeight = 36;

    let {
      partyObject,
      entities,
      setPartyAction,
      vehicleGrid,
      invoiceGrid,
      partyRelGrid
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
            <PartyContactList partyObject={partyObject} entities={entities} setPartyAction={setPartyAction}/>
            <PartyRoleList partyObject={partyObject} entities={entities} setPartyAction={setPartyAction}/>
          </div>
        </div>
      </form>
    );

    const tabArray = [
      <Tab label="Vehicles" style={{height:tabHeight}} onActive={this.activateTab.bind(this, vehicleGrid)} key={vehicleGridLocation}>
        {(partyObject.$grids[vehicleGridLocation]) ?
          <GridComp ref={vehicleGridLocation} grid={vehicleGrid} uiLocation="tab" updateGrid={this.updateGrid}/>
          : ''}
      </Tab>,
      <Tab label="Invoices" style={{height:tabHeight}} onActive={this.activateTab.bind(this, invoiceGrid)} key={invoiceGridLocation}>
        {(partyObject.$grids[invoiceGridLocation]) ?
          <GridComp ref={invoiceGridLocation} grid={invoiceGrid} uiLocation="tab" updateGrid={this.updateGrid}/>
          : ''}
      </Tab>,
      <Tab label="Relationships" style={{height:tabHeight}} onActive={this.activateTab.bind(this, partyRelGrid)} key={partyRelGridLocation}>
        {(partyObject.$grids[partyRelGridLocation]) ?
          <GridComp ref={partyRelGridLocation} grid={partyRelGrid} uiLocation="tab" updateGrid={this.updateGrid}/>
          : ''}
      </Tab>
    ];

    if (this.mediaQuery.matches) {
      tabArray.shift();
    }

    const tabs = (
      <Tabs  className="detail-grid" tabTemplate={TabTemplate} tabItemContainerStyle={{height:tabHeight}} contentContainerStyle={{width: '100%', flexGrow: 1, display: 'flex', minHeight: 0}} >
        {tabArray.map(t => t)}
      </Tabs>
    );

    if (this.mediaQuery.matches) {
      return (
        <main className="main-content" style={{display: 'flex', flexDirection: 'row', height: '100%'}} >
          <div style={{display: 'flex', flexDirection: 'column', height: '100%', flexBasis: '50%', flexShrink: 0}}>
            {this._createToolMenu(partyObject)}
            {mainForm}
            {tabs}
          </div>
          <GridComp ref={vehicleGridLocation} grid={vehicleGrid} uiLocation="main" updateGrid={this.updateGrid}/>
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


