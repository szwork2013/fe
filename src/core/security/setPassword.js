import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import History from 'react-router/lib/History';
import When from 'when';
import { connect } from 'react-redux';
import { FlatButton, Styles, FontIcon, TextField, RaisedButton} from 'material-ui';

import createForm from 'core/form/createForm';
import PageAncestor from 'core/common/page/pageAncestor';
import Toolmenu from 'core/components/toolmenu/toolmenu';
import {store} from 'core/common/redux/store';
import MdEntityService from 'core/metamodel/mdEntityService';
import SecurityService from 'core/security/securityService';
import CommonService from 'core/common/service/commonService';
import {setPasswordAction} from 'core/security/securityActions';
import {customizeThemeForDetail}  from 'core/common/config/mui-theme';
import BlockComp from 'core/components/blockComp/blockComp';
import {Validate} from 'core/form/validate';
import {AreSame, HasLength} from 'core/form/rules';
import {preSave} from 'core/form/formUtils';
import {ErrorComp} from 'core/components/errorComp/errorComp';

const Colors = Styles.Colors;



function mapStateToProps(state) {
  let passwordObject = state.getIn(['security', 'passwordObject']);

  return {
    passwordObject,
    entities: state.getIn(['metamodel', 'entities'])
  };
}


@connect(mapStateToProps, {setPasswordAction})
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
      .then(passwordObject => {
        return store.dispatch(setPasswordAction(passwordObject));
      });


    return When.all([metadataPromise, userPromise])
      .then(array => {
        CommonService.loading(false);
        return array;
      })
  }

  componentWillMount() {
    console.debug('SetPassword#componentWillMount, props: %o', this.props);
    customizeThemeForDetail(this.context.muiTheme);
  }

  componentWillUnmount() {
    this.props.setPasswordAction(null);
  }


  onSubmit = (evt) => {
    evt.preventDefault();
    console.log('onSubmit ');

    let {passwordObject, setPasswordAction} = this.props;

    let result = preSave(passwordObject, null, true);
    if (!result) {
      setPasswordAction(passwordObject);
      return;
    }

    CommonService.loading(true);

    SecurityService.resetPassoword(passwordObject, this.context.router.getCurrentParams().mode)
    .then( response => {
      CommonService.loading(false);
      CommonService.toastSuccess("Heslo bylo změněno");
      this.onCancel(null);
    }, (error) => {
      Object.assign(passwordObject, {oldPassword: undefined, password1: undefined, password2: undefined, $errors: error.data.messages});
      setPasswordAction(passwordObject);
    });

  };


  onCancel = (evt) => {
    console.log('onBack');
    if (History.length <= 1) {
      this.context.router.transitionTo("home");
    } else {
      this.context.router.goBack();
    }

  };


  render() {


    let {
      passwordObject,
      entities,
      setPasswordAction,
      } = this.props;


    console.debug('%c userProfile render', 'background-color: yellow');

    return (
      <main className="main-content container">
        <ErrorComp messages={passwordObject.$errors} />
        <div className="row">
          <div className="col-xs-offset-1 col-xs-10">
            <h4>Change Password</h4></div>
        </div>

        <SetPasswordForm dataObject={passwordObject} rootObject={passwordObject} entity={entities.get('User')}
                         entities={entities} setDataAction={setPasswordAction} routeParams={this.context.router.getCurrentParams()}
                         onCancel={this.onCancel} onSubmit={this.onSubmit}/>
      </main>
    );
  }




}




class SetPasswordForm extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);



  render() {

    let {dataObject, rootObject, entities, routeParams, onSubmit, onCancel} = this.props;
    let {oldPassword, password1, password2}= dataObject.$forms[definition.formName].fields;


    return (
      <form onSubmit={onSubmit}>
        { (routeParams.mode === 'USER') ? (
          <div className="row">
            <div className="col-xs-offset-1 col-xs-10">
              <TextField type="password" {...oldPassword.props} style={{maxWidth:300}}/>
              <Validate field={oldPassword} value={oldPassword.props.value}/>
            </div>
          </div>
        ): null}
        <div className="row" >
          <div className="col-xs-offset-1 col-xs-10" style={{display: 'flex', flexWrap: 'nowrap'}}>
            <TextField type="password" {...password1.props} style={{maxWidth:300}} />
            <Validate field={password1} value={password1.props.value}>
              <HasLength min={6}/>
            </Validate>
            <TextField type="password" {...password2.props} style={{maxWidth:300, marginLeft: 20}} />
            <Validate field={password2} value={password2.props.value} needTouch={[['AreSame', 'value1'], ['AreSame', 'value2']]}>
              <HasLength min={6}/>
              <AreSame value1={password1.props.value} value2={password2.props.value} />
            </Validate>
          </div>
        </div>
        <div className="row" style={{marginTop:20}}>
          <div className="col-xs-offset-1 col-xs-10">
            <RaisedButton type="submit"  label="OK" primary={true} />
            <RaisedButton type="button"  onClick={onCancel} label="Cancel"  style={{marginLeft:20}}/>
          </div>
        </div>
      </form>

    );
  }
}

const definition = {
  formName: 'UserForm',
  fields: [{
    name: 'oldPassword', big: true,
    validators: ['IsRequired']
  }, {
    name: 'password1', big: true,
    validators: ['IsRequired']
  }, {
    name: 'password2', big: true,
    validators: ['IsRequired']
  }
  ]
};

SetPasswordForm = createForm(definition, SetPasswordForm);

