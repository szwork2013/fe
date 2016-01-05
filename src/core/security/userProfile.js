import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import History from 'react-router/lib/History';
import When from 'when';
import { connect } from 'react-redux';
import { FlatButton, Styles, FontIcon} from 'material-ui';

import PageAncestor from 'core/common/page/pageAncestor';
import Toolmenu from 'core/components/toolmenu/toolmenu';
import {store} from 'core/common/redux/store';
import MdEntityService from 'core/metamodel/mdEntityService';
import SecurityService from 'core/security/securityService';
import CommonService from 'core/common/service/commonService';
import {setUserProfileAction} from 'core/security/securityActions';
import {customizeThemeForDetail}  from 'core/common/config/mui-theme';
import BlockComp from 'core/components/blockComp/blockComp';


const Colors = Styles.Colors;



function mapStateToProps(state) {
  let userProfileObject = state.getIn(['security', 'userProfileObject']);

  return {
    userProfileObject,
    entities: state.getIn(['metamodel', 'entities'])
  };
}


@connect(mapStateToProps, {setUserProfileAction})
export default class UserProfile extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  static title = 'My Profile';
  static icon = 'user';

  static willTransitionTo = PageAncestor.willTransitionTo;
  static willTransitionFrom = PageAncestor.willTransitionFrom;


  static contextTypes = {
    router: React.PropTypes.func.isRequired,
    muiTheme: React.PropTypes.object
  };

  static fetchData(routerParams, query) {
    console.log("UserProfile#fetchData()");

    let metadataPromise = MdEntityService.fetchEntityMetadata(['User'], [{entity: 'Tenant', lov: true}, 'Party']);

    let currentUser = store.getState().getIn(['security', 'currentUser']);

    let userPromise = SecurityService.readUser(currentUser.get('username'))
      .then(userProfileObject => {
        return store.dispatch(setUserProfileAction(userProfileObject));
      });


    return When.all([metadataPromise, userPromise])
      .then(array => {
        CommonService.loading(false);
        return array;
      })
  }

  componentWillMount() {
    console.debug('UserProfile#componentWillMount, props: %o', this.props);
    customizeThemeForDetail(this.context.muiTheme);
  }

  componentWillUnmount() {
    this.props.setUserProfileAction(null);
  }

  onDetail = (evt) => {
    console.log('onDetail');
    this.context.router.transitionTo('partyDetail', {id: this.props.userProfileObject.party.partyId});
  };

  onSetPassword = (evt) => {
    console.log('onSetPassword');
    this.context.router.transitionTo('setPassword', {mode: 'USER'});
  };


  onBack = (evt) => {
    console.log('onBack %O', this.context.router);
    this.context.router.goBack();
  };


  render() {


    let {
      userProfileObject,
      entities,
      setUserProfileAction,
      } = this.props;

    let tenantLovs = entities.get('Tenant').lovItems.filter(li => userProfileObject.tenants.includes(li.value));


    console.debug('%c userProfile render', 'background-color: yellow');


    return (
      <main className="main-content container">
        {this._createToolMenu(userProfileObject)}

        <BlockComp style={{marginTop: 10}} header="User Profile">
          <div style={{display: 'flex', alignItems: 'baseline'}}>
            <div style={{fontSize: '18px', fontWeight: 'bold', marginRight: 8}}>{userProfileObject.username}</div>
            <FlatButton onClick={this.onDetail} secondary={true} label="Edit" labelPosition="after"
                        labelStyle={{paddingLeft: 8}} style={{paddingLeft: 5}}>
              <FontIcon className="fa fa-pencil" style={{fontSize:14, color: Colors.indigo500}}/>
            </FlatButton>
            <div>Available Tenants:</div>
            <ul>
              {
                tenantLovs.map(li => (<li style={{listStyleType: 'none'}} key={li.value}>{li.label}</li>))
              }
            </ul>
          </div>
        </BlockComp>

      </main>
    );

  }


  _createToolMenu(userProfileObject) {
    return (
      <Toolmenu>
        <FlatButton onClick={this.onSetPassword}>
          <span className="fa fa-unlock-alt"/><span> Set password</span>
        </FlatButton>

        <FlatButton onClick={this.onBack} disabled={History.length <= 1}>
          <span className="fa fa-chevron-left"/><span> Back</span>
        </FlatButton>
      </Toolmenu>
    );
  }


}

