import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import History from 'react-router/lib/History';
import When from 'when';
import { connect } from 'react-redux';
import { FlatButton, Styles, FontIcon} from 'material-ui';

import createForm from 'core/form/createForm';
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
export default class SetPassword extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  static title = 'set password';
  static icon = 'unlock-alt';

  static willTransitionTo = PageAncestor.willTransitionTo;
  static willTransitionFrom = PageAncestor.willTransitionFrom;


  static contextTypes = {
    router: React.PropTypes.func.isRequired,
    muiTheme: React.PropTypes.object
  };

  static fetchData(routerParams, query) {
    console.log("UserProfile#fetchData()");

    let metadataPromise = MdEntityService.fetchEntities(['User']);

    let currentUser = store.getState().getIn(['security', 'currentUser']);
    let username = (routerParams.mode === 'ADMIN') ? routerParams.id : currentUser.get('username');

    let userPromise = SecurityService.readUser(username)
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


    console.debug('%c userProfile render', 'background-color: yellow');

    return (
      <main className="main-content container">
        <SetPasswordForm dataObject={userObject} rootObject={userObject} entity={entities.get('User')}  entities={entities} setDataAction={setUserAction} />
      </main>
    );
  }




}




class SetPasswordForm extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);



  render() {

    let {dataObject, rootObject, entities} = this.props;
    let {oldPassword, password1, password2}= dataObject.$forms[definition.formName].fields;


    return (
      <form>
        <div className="row">
          <div className="col-xs-6 col-sm-4">
            <TextField {...oldPassword.props} />
            <Validate field={oldPassword} value={oldPassword.props.value}/>
          </div>
        </div>
      </form>

    );
  }
}

const definition = {
  formName: 'UserForm',
  fields: [{
    name: 'oldPassword',
    validators: ['IsRequired']
  }, {
    name: 'password1',
    validators: ['IsRequired']
  }, {
    name: 'password2',
    validators: ['IsRequired']
  }
  ]
};

SetPasswordForm = createForm(definition, SetPasswordForm);

