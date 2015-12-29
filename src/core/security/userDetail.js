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
import SecurityService from 'core/security/securityService';
import PartyService from 'party/partyService';
import {setUserAction, updateGridAction} from 'core/security/securityActions';
import {customizeThemeForDetail, TabTemplate}  from 'core/common/config/mui-theme';
import {screenLg} from 'core/common/config/variables';
import BlockComp from 'core/components/blockComp/blockComp';
import {selectGrid} from 'core/form/formUtils';

import UserForm from 'core/security/userForm';
import PartySelector from 'party/component/partySelector';

import GridService from 'core/grid/gridService';
import Grid from 'core/grid/domain/grid';
import GridComp from 'core/grid/component/gridComp';

const Colors = Styles.Colors;
const Typography = Styles.Typography;

const tenantGridLocation = 'tenantList';

function mapStateToProps(state) {
  let userObject = state.getIn(['security', 'userObject']);

  return {
    userObject,
    tenantGrid: selectGrid(state, userObject, tenantGridLocation),
    entities: state.getIn(['metamodel', 'entities'])
  };
}


@connect(mapStateToProps, {setUserAction, updateGridAction})
export default class UserDetail extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  static title = 'User';
  static icon = 'user';

  static willTransitionTo = PageAncestor.willTransitionTo;
  static willTransitionFrom = PageAncestor.willTransitionFrom;


  static contextTypes = {
    router: React.PropTypes.func.isRequired,
    muiTheme: React.PropTypes.object
  };

  static fetchData(routerParams, query) {
    console.log("UserDetail#fetchData()");

    let metadataPromise = MdEntityService.fetchEntityMetadata(['User'], ['Tenant', 'Party']);

    let userPromise = ((routerParams.id === 'new') ? When(Object.assign({
      gridConfigs: [],
      tenants: [],
      defaultGridConfig: {},
      $open: true,
      enabled: true
    }, query)) : SecurityService.readUser(routerParams.id))
      .then(userObject => {
        userObject.$grids = {};
        userObject.$partySelector = {};
        return store.dispatch(setUserAction(userObject));
      });

    let gridPromise = GridService.fetchGrids(tenantGridLocation);

    return When.all([metadataPromise, userPromise, gridPromise]);
  }


  /**
   *
   */
  componentWillMount() {
    console.debug('UserDetail#componentWillMount, props: %o', this.props);

    customizeThemeForDetail(this.context.muiTheme);

    let {tenantGrid,updateGridAction} = this.props;


    tenantGrid.activeGridConfig = tenantGrid.getActiveGridConfig();
    updateGridAction(tenantGrid);
  }


  componentDidMount() {
    this.refs[this.props.tenantGrid.gridLocation].search();
  }

  componentWillUnmount() {
    this.props.setUserAction(null);
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


  onPartyChange = (partyObject) => {
    console.log('onPartyChange %O', partyObject);
    let {userObject, setUserAction} = this.props;
    userObject.party = partyObject;
    setUserAction(userObject);
  };


  getSelectTenant = (tenantId, index) => {
    //console.log('getSelectTenant %s .. %s', tenantId, index);
    return this.props.userObject.tenants.includes(tenantId);
  };

  setSelectTenant = (tenantId, index, checked) => {
    let {userObject, setUserAction} = this.props;
    console.log('setSelectTenant %s .. %s...%s', tenantId, index, checked);
    let ti = userObject.tenants.indexOf(tenantId);
    if (checked) {
      if (ti === -1) userObject.tenants.push(tenantId);
    } else {
      if (ti >= 0) userObject.tenants.splice(ti, 1);
    }
    setUserAction(userObject);
  };

  render() {


    let {
      userObject,
      entities,
      setUserAction,
      tenantGrid,
      updateGridAction
      } = this.props;

    let propsForCreateForm = {
      dataObject: userObject,
      rootObject: userObject,
      entity: entities.get('User'),
      entities,
      setDataAction: setUserAction
    };


    console.debug('%c userDetail render $open = %s', 'background-color: yellow', userObject.$open);


    return (
      <main className="main-content container">
        {this._createToolMenu(userObject)}

        <BlockComp style={{marginTop: 10}} header="User">
          <form >
            <UserForm {...propsForCreateForm} />
          </form>
        </BlockComp>
        <div className="row">
          <div className="col-xs-12 col-sm-6" style={{display: 'flex', flexDirection: 'column'}}>
            <BlockComp header="Connected Party" style={{flexGrow: 1}}>
              <PartySelector partyObject={userObject.party} dataObject={userObject} partyEntity={entities.get('Party')}
                             onPartyChange={this.onPartyChange}  setDataAction={setUserAction} />
            </BlockComp>
          </div>
          <div className="col-xs-12 col-sm-6">
            <BlockComp header="Available Tenants">
              <GridComp ref={tenantGrid.gridLocation} grid={tenantGrid} multiSelect={false} gridClassName="detail-grid" bodyStyle={{paddingBottom: 7}}
                        uiLocation="main" updateGrid={updateGridAction} functionMap={{getSelectTenant: this.getSelectTenant.bind(this), setSelectTenant: this.setSelectTenant.bind(this)}} />
            </BlockComp>
          </div>
        </div>

      </main>
    );


  }


  _createToolMenu(userObject) {
    return (
      <Toolmenu>
        <FlatButton onClick={this.onSave}>
          <span className="fa fa-save"/><span> Save User</span>
        </FlatButton>
        { (userObject.party > 0) ? (
          <FlatButton onClick={this.onDelete}>
            <span className="fa fa-trash"/><span> Delete User</span>
          </FlatButton>
        ) : <div/>}
        <FlatButton onClick={this.onBack} disabled={History.length <= 1}>
          <span className="fa fa-chevron-left"/><span> Back</span>
        </FlatButton>
      </Toolmenu>
    );
  }


}

