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
const partyRelGridLocation = 'partyRelList';


function mapStateToProps(state) {
  return {
    partyObject: state.getIn(['party', 'partyObject']),
    entities: state.getIn(['metamodel', 'entities']),
    vehicleGrid: state.getIn(['grid', 'grids', vehicleGridLocation]),
    invoiceGrid: state.getIn(['grid', 'grids', invoiceGridLocation]),
    partyRelGrid: state.getIn(['grid', 'grids', partyRelGridLocation])
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

  static willTransitionFrom(transition, component) {
    PageAncestor.willTransitionFrom(transition, component);
    //
    //let {vehicleGrid, invoiceGrid, partyRelGrid} = component.props;
    //console.log("partyDetail#willTransitionFrom() - resetting grids");
    //vehicleGrid.reset();
    //invoiceGrid.reset();
    //partyRelGrid.reset();
    //
  }


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

    let gridPromise = GridService.fetchGrids(vehicleGridLocation, invoiceGridLocation, partyRelGridLocation);

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

    const {partyObject, vehicleGrid} = this.props;
    partyObject.$openedTabs = {};

    vehicleGrid.activeGridConfig = vehicleGrid.getActiveGridConfig();
    vehicleGrid.masterId = partyObject.partyId;
    partyObject.$openedTabs[vehicleGridLocation] = true;
  }

  componentWillReceiveProps(nextProps) {
    let {partyObject, vehicleGrid, invoiceGrid, partyRelGrid, updateGridAction} = this.props;
    if (nextProps.partyObject.partyId && nextProps.partyObject.partyId !== partyObject.partyId) {
      console.log("partyDetail#componentWillReceiveProps() - change of party, resetting grids");
      nextProps.partyObject.$openedTabs = {};
      nextProps.partyObject.$openedTabs[partyRelGridLocation] = true;
      partyRelGrid.masterId = nextProps.partyObject.partyId;
      this.refs[partyRelGridLocation].search(true);
    }
  }

  onActiveVehicle = (tab) => {
    let {vehicleGrid, partyObject, setPartyAction, updateGridAction} = this.props;

    vehicleGrid.activeGridConfig = vehicleGrid.getActiveGridConfig();
    vehicleGrid.masterId = partyObject.partyId;
    partyObject.$openedTabs[vehicleGridLocation] = true;

    console.log('onActiveVehicle vehicleGrid = ', vehicleGrid);
    setPartyAction(partyObject);
    updateGridAction(vehicleGrid);
  };

  onActiveInvoice = (tab) => {
    let {invoiceGrid, partyObject, setPartyAction, updateGridAction} = this.props;

    invoiceGrid.activeGridConfig = invoiceGrid.getActiveGridConfig();
    invoiceGrid.masterId = partyObject.partyId;
    partyObject.$openedTabs[invoiceGridLocation] = true;

    console.log('onActiveInvoice invoiceGrid = ', invoiceGrid);
    setPartyAction(partyObject);
    updateGridAction(invoiceGrid);
  };

  onActivePartyRel = (tab) => {
    let {partyRelGrid, partyObject, setPartyAction, updateGridAction} = this.props;

    partyRelGrid.activeGridConfig = partyRelGrid.getActiveGridConfig();
    partyRelGrid.masterId = this.props.partyObject.partyId;

    partyObject.$openedTabs[partyRelGridLocation] = true;

    console.log('onActivePartyRel partyRelGrid = ', partyRelGrid);
    setPartyAction(partyObject);
    updateGridAction(partyRelGrid);
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
    console.debug('%c partyDetail render', 'background-color: yellow');

    const tabHeight = 36;

    const {
      partyObject,
      entities,
      setPartyAction,
      vehicleGrid,
      invoiceGrid,
      partyRelGrid
      } = this.props;

    const propsForCreateForm = {
      dataObject: partyObject,
      rootObject: partyObject,
      entity: entities.get('Party'),
      entities,
      setDataAction: setPartyAction
    };





    return (

      <main className="main-content" style={{display: 'flex', flexDirection: 'column', height: '100%'}} >
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


        <Tabs  className="detail-grid" tabTemplate={TabTemplate} tabItemContainerStyle={{height:tabHeight}} contentContainerStyle={{width: '100%', flexGrow: 1, display: 'flex', minHeight: 0}} >
          <Tab label="Vehicles" style={{height:tabHeight}} onActive={this.onActiveVehicle}>
            {(partyObject.$openedTabs[vehicleGridLocation]) ?
             <GridComp grid={vehicleGrid} uiLocation="tab"/>
              : ''}
          </Tab>
          <Tab label="Invoices" style={{height:tabHeight}} onActive={this.onActiveInvoice}>
            {(partyObject.$openedTabs[invoiceGridLocation]) ?
              <GridComp grid={invoiceGrid} uiLocation="tab" />
            : ''}
          </Tab>
          <Tab label="Relationships" style={{height:tabHeight}} onActive={this.onActivePartyRel}>
            {(partyObject.$openedTabs[partyRelGridLocation]) ?
              <GridComp ref={partyRelGridLocation} grid={partyRelGrid} uiLocation="tab" />
              : ''}
          </Tab>
        </Tabs>








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


