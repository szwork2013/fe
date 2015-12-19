import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
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

import PartyFoForm from 'party/component/partyFoForm';
import PartyPoForm from 'party/component/partyPoForm';
import PartyContactList from 'party/component/partyContactList';
import PartyRoleList from 'party/component/partyRoleList';
import PartyAddressList from 'party/component/partyAddressList';

import GridService from 'core/grid/gridService';
import GridComp from 'core/grid/component/gridComp';
import {updateGridAction} from 'core/grid/gridActions';

const Colors = Styles.Colors;
const Typography = Styles.Typography;
const vehicleGridLocation = 'partyVehicleList';
const invoiceGridLocation = 'partyInvoiceList';


function mapStateToProps(state) {
  return {
    partyObject: state.getIn(['party', 'partyObject']),
    entities: state.getIn(['metamodel', 'entities']),
    vehicleGrid: state.getIn(['grid', 'grids', vehicleGridLocation]),
    //invoiceGrid: state.getIn(['grid', 'grids', invoiceGridLocation])
  };
}


@connect(mapStateToProps, {setPartyAction, updateGridAction})
export default class PartyDetail extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  static title = 'Customer';
  static icon = 'user';
  static willTransitionFrom = PageAncestor.willTransitionFrom;
  static willTransitionTo = PageAncestor.willTransitionTo;

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
      roles: []
    }, query)) : PartyService.readParty(routerParams.id))
      .then(partyObject => store.dispatch(setPartyAction(partyObject)));

    let gridPromise = GridService.fetchGrids(vehicleGridLocation, invoiceGridLocation);

    return When.all([metadataPromise, partyPromise, gridPromise]);
  }

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


    let vehicleGrid = this.props.vehicleGrid;
    vehicleGrid.activeGridConfig = vehicleGrid.getActiveGridConfig();
    vehicleGrid.masterId = this.props.partyObject.partyId;

    //console.log(vehicleGrid.activeGridConfig);
    //updateGridAction(vehicleGrid);
  }

  onGridChange = (grid) => {
    console.debug('onGridChange(%o)', grid);
    //
    //var routeName = _.last(this.context.router.getCurrentRoutes()).name,
    //  params = this.context.router.getCurrentParams();
    //
    //if (grid.activeGridConfig) params.gridId = grid.activeGridConfig.gridId;
    //
    //let query = Object.assign({
    //  searchTerm: grid.searchTerm,
    //  sort: grid.sort
    //}, grid.getConditionQueryObject());
    //
    //console.debug('replaceWith %s, %o, %o', routeName, params, query);
    //
    //this.context.router.replaceWith(routeName, params, query);
  };

  onActiveInvoice = (tab) => {
    console.debug('onActiveInvoice(%o)', tab);
    let invoiceGrid = this.props.invoiceGrid;
    invoiceGrid.activeGridConfig = invoiceGrid.getActiveGridConfig();
    invoiceGrid.masterId = this.props.partyObject.partyId;

    console.log(invoiceGrid.activeGridConfig);
    updateGridAction(invoiceGrid);
    //this.forceUpdate();
  };


  onSave = (evt) => {
    console.log('onSave');
  };
  onDelete = (evt) => {
    console.log('onDelete');
  };
  onBack = (evt) => {
    console.log('onBack');
    this.context.router.goBack();
  };


  render() {
    const tabHeight = 36;

    const {
      partyObject,
      entities,
      setPartyAction,
      vehicleGrid,
      invoiceGrid
      } = this.props;

    const propsForCreateForm = {
      dataObject: partyObject,
      rootObject: partyObject,
      entity: entities.get('Party'),
      entities,
      setDataAction: setPartyAction
    };

    return (

      <main className="main-content" >
        {this._createToolMenu(partyObject)}
        <form style={{marginTop: 10}}>
          <div className="row">
            <div className="col-xs-12 col-lg-6">
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
            </div>
          </div>
        </form>


        <div className="detail-grid" style={{height: 400}}>

          <Tabs tabItemContainerStyle={{height:tabHeight}} contentContainerStyle={{width: '100%', height: '100%'}} style={{width: '100%', height: '100%'}} >
            <Tab label="Vehicles" style={{height:tabHeight}}>
              <GridComp grid={vehicleGrid} uiLocation="tab" onGridChange={this.onGridChange}/>
            </Tab>
            <Tab label="Invoices" style={{height:tabHeight}} onActive={this.onActiveInvoice}>
              {/*<GridComp grid={invoiceGrid} uiLocation="tab" onGridChange={this.onGridChange}/> */}
            </Tab>
            <Tab
              label="Item Three"
              route="home"
              onActive={this._handleTabActive} style={{height:tabHeight}}/>
          </Tabs>



        </div>




      </main>

    );
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
        <FlatButton onClick={this.onBack}>
          <span className="fa fa-chevron-left"/><span> Back</span>
        </FlatButton>
      </Toolmenu>
    );
  }


}


