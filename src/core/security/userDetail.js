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
import CommonService from 'core/common/service/commonService';
import PartyService from 'party/partyService';
import {setUserAction, updateGridAction} from 'core/security/securityActions';
import {customizeThemeForDetail, TabTemplate}  from 'core/common/config/mui-theme';
import {screenLg} from 'core/common/config/variables';
import BlockComp from 'core/components/blockComp/blockComp';
import {selectGrid, preSave} from 'core/form/formUtils';
import {ErrorComp} from 'core/components/errorComp/errorComp';

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

var $freshLoadFlag = false;

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
    $freshLoadFlag = true;

    let metadataPromise = MdEntityService.fetchEntityMetadata(['User'], ['Tenant', 'Party']);

    let userPromise = ((routerParams.id === 'new') ? When(Object.assign({
      gridConfigs: [],
      tenants: [],
      defaultGridConfig: {},
      enabled: true,
      $new: true
    }, query)) : SecurityService.readUser(routerParams.id))
      .then(userObject => {
        userObject.$grids = {};
        userObject.$partySelector = {};
        return store.dispatch(setUserAction(userObject));
      });

    let gridPromise = GridService.fetchGrids(tenantGridLocation);

    return When.all([metadataPromise, userPromise, gridPromise])
      .then(array => {
        CommonService.loading(false);
        return array;
      })
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


  /**
   * tohle je tady kvuli prechodu na jiny detail party (z relationship vazeb), kdy react-router neudela reload
   * @param prevProps
   */
  componentDidUpdate(prevProps) {
    if ($freshLoadFlag) {
      $freshLoadFlag = false;
      console.log("userDetail#componentDidUpdate() - save, reload, resetting grids");

      let {tenantGrid,updateGridAction} = this.props;
      tenantGrid.activeGridConfig = tenantGrid.getActiveGridConfig();
      this.refs[this.props.tenantGrid.gridLocation].search();
    }
  }


  componentDidMount() {
    $freshLoadFlag = false;
    this.refs[this.props.tenantGrid.gridLocation].search();
  }

  componentWillUnmount() {
    this.props.setUserAction(null);
  }

  customValidate = (userObject) => {
    let errors = [];
    if (userObject.tenants.length === 0) {
      errors.push({message: "At least one tenant must be selected"})
    }
    if (!userObject.party) {
      errors.push({message: "Party must be selected"});
    }
    return errors;
  };


  onSave = (doReturn, evt) => {
    console.log('onSave');
    let {userObject, setUserAction} = this.props;

    let result = preSave(userObject, this.customValidate);
    if (!result) {
      setUserAction(userObject);
      return;
    }

    CommonService.loading(true);
    let promise = (userObject.$new) ? SecurityService.userCreate(userObject) : SecurityService.userUpdate(userObject);
    promise.then( (username) => {
        if(doReturn) {
          this.context.router.goBack();
          CommonService.loading(false);
        } else {
          if(userObject.$new) {
            this.context.router.replaceWith('userDetail', {id: username});
          } else {
            this.context.router.refresh();
          }
        }
        CommonService.toastSuccess("User " + userObject.username + " byl úspěšně uložen");
      });

  };


  onDelete = (evt) => {
    console.log('onDelete');
    let {userObject, setUserAction} = this.props;

    CommonService.loading(true);
    SecurityService.deleteUser(userObject.username)
      .then(response => {
        if (History.length <= 1) {
          this.context.router.transitionTo('home');
        } else {
          this.context.router.goBack();
        }
        CommonService.loading(false);
      }, error => {
        userObject.$errors = error.data.messages;
        setUserAction(userObject, 'userDetail#onDelete()');
      });
  };

  onSetPassword = (evt) => {
    console.log('onSetPassword');
    let {userObject, setUserAction} = this.props;

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


    console.debug('%c userDetail render', 'background-color: yellow');


    return (
      <main className="main-content container">
        {this._createToolMenu(userObject)}

        <ErrorComp messages={userObject.$errors} />

        <BlockComp style={{marginTop: 10}} header="User">
          <form >
            <UserForm {...propsForCreateForm} />
          </form>
        </BlockComp>
        <div className="row">
          <div className="col-xs-12 col-sm-6" style={{display: 'flex', flexDirection: 'column'}}>
            <BlockComp header="Connected Party" style={{flexGrow: 1}}>
              <PartySelector partyObject={userObject.party} dataObject={userObject} partyEntity={entities.get('Party')}
                             onPartyChange={this.onPartyChange}  setDataAction={setUserAction} entities={entities} newPartyTemplate={{partyCategory: 'FO', roles: [{roleType:4}]}} />
            </BlockComp>
          </div>
          <div className="col-xs-12 col-sm-6">
            <BlockComp header="Available Tenants">
              <GridComp ref={tenantGrid.gridLocation} grid={tenantGrid} multiSelect={false} hideToolbar={true} gridClassName="detail-grid" bodyStyle={{paddingBottom: 7}}
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
        <FlatButton onClick={this.onSave.bind(this, false)}>
          <span className="fa fa-save"/><span> Save</span>
        </FlatButton>
        <FlatButton onClick={this.onSave.bind(this, true)} disabled={History.length <= 1}>
          <span className="fa fa-save"/><span> Save and return</span>
        </FlatButton>
        { (!userObject.$new) ? (
          <FlatButton onClick={this.onSetPassword}>
            <span className="fa fa-unlock-alt"/><span> Set password</span>
          </FlatButton>
        ) : <noscript/>}
        { (!userObject.$new) ? (
          <FlatButton onClick={this.onDelete}>
            <span className="fa fa-trash"/><span> Delete User</span>
          </FlatButton>
        ) : <noscript/>}


        <FlatButton onClick={this.onBack} disabled={History.length <= 1}>
          <span className="fa fa-chevron-left"/><span> Back</span>
        </FlatButton>
      </Toolmenu>
    );
  }


}

