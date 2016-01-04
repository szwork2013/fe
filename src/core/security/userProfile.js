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
import {setUserAction} from 'core/security/securityActions';
import {customizeThemeForDetail}  from 'core/common/config/mui-theme';
import BlockComp from 'core/components/blockComp/blockComp';


const Colors = Styles.Colors;



function mapStateToProps(state) {
  let userObject = state.getIn(['security', 'userObject']);

  return {
    userObject,
    entities: state.getIn(['metamodel', 'entities'])
  };
}


@connect(mapStateToProps, {setUserAction})
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
      .then(userObject => {
        return store.dispatch(setUserAction(userObject));
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
    this.props.setUserAction(null);
  }

  onDetail = (evt) => {
    console.log('onDetail');
    this.context.router.transitionTo('partyDetail', {id: this.props.userObject.party.partyId})
  };

  onSetPassword = (evt) => {
    console.log('onSetPassword');
    let {userObject, setUserAction} = this.props;

  };


  onBack = (evt) => {
    console.log('onBack %O', this.context.router);
    this.context.router.goBack();
  };


  render() {


    let {
      userObject,
      entities,
      setUserAction,
      } = this.props;

    let tenantLovs = entities.get('Tenant').lovItems.filter(li => userObject.tenants.includes(li.value));


    console.debug('%c userProfile render', 'background-color: yellow');


    return (
      <main className="main-content container">
        {this._createToolMenu(userObject)}

        <BlockComp style={{marginTop: 10}} header="User Profile">
          <div style={{display: 'flex', alignItems: 'baseline'}}>
            <div style={{fontSize: '18px', fontWeight: 'bold', marginRight: 8}}>{userObject.username}</div>
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


  _createToolMenu(userObject) {
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

