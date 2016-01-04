import React from 'react';
import {Record, List} from 'immutable';
import {get} from 'lodash';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {TextField, RaisedButton, SelectField, Checkbox} from 'material-ui';
import { Alert } from 'react-bootstrap';

import createForm from 'core/form/createForm';
import {FieldText} from 'core/form/formUtils';
import StyledSelect from 'core/components/styledSelect/styledSelect';
import ActiveItem from 'core/components/blockComp/activeItem';
import {Validate} from 'core/form/validate';
import {valid, invalid, AreSame, HasLength} from 'core/form/rules';
import SecurityService from 'core/security/securityService';


function UserExist({value}) {
  if (!value) return valid();
  return SecurityService.userExist(value)
    .then( (exists) => (exists) ? invalid(`User ${value} already exists`) : valid());
}


class UserForm extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);



  render() {

    let {dataObject, rootObject, lastValue,  entities} = this.props;
    let {username, enabled, locked, expired, password1, password2}= dataObject.$forms[definition.formName].fields;

    let openContent = (
      <div>

        {/*  1. row  */}
        <div className="row">
          <div className="col-xs-6 col-sm-4">
            <TextField {...username.props} disabled={!dataObject.$new} />
            <Validate field={username} value={username.props.value}>
              {(dataObject.$new) ? <UserExist/> : null}
            </Validate>
          </div>
        </div>

        {/*  2. row  */}
        <div className="row">
          <div className="col-xs-6 col-sm-4">
            <Checkbox {...enabled.props} />
          </div>
          <div className="col-xs-6 col-sm-4">
            <Checkbox {...locked.props} />
          </div>
          <div className="col-xs-6 col-sm-4">
            <Checkbox {...expired.props} />
          </div>
        </div>

        {/*  3. row  */}
        { (dataObject.$new) ?
          <div className="row">
            <div className="col-xs-6 col-sm-4">
              <TextField type="password" {...password1.props} />
              <Validate field={password1} value={password1.props.value}>
                <HasLength min={6}/>
              </Validate>
            </div>
            <div className="col-xs-6 col-sm-4">
              <TextField type="password" {...password2.props} />
              <Validate field={password2} value={password2.props.value} needTouch={[['AreSame', 'value1'], ['AreSame', 'value2']]}>
                <HasLength min={6}/>
                <AreSame value1={password1.props.value} value2={password2.props.value} />
              </Validate>
            </div>
          </div>
          : null
        }

      </div>
    );


    let closedContent = (
      <div style={{display: 'flex', flexDirection: 'column', cursor: 'pointer'}}>

        <h5 style={{marginTop: 0, fontSize: '18px', fontWeight: 'bold'}}>{dataObject.username}</h5>
        <div className="form-text-row">
          <FieldText value={ (dataObject.enabled) ? 'Enabled' : 'Disabled' }/>
          <FieldText value={ (dataObject.locked) ? 'Locked' : '' }/>
          <FieldText value={ (dataObject.expired) ? 'Expired' : '' }/>
        </div>

      </div>
    );


    return (
        <ActiveItem openContent={openContent} closedContent={closedContent} lastValue={true} tabIndex={0} {...this.props} validate={this.props.validate} />
    );
  }
}

const definition = {
  formName: 'UserForm',
  fields: [{
    name: 'username',
    validators: ['IsRequired']
  },{
    name: 'enabled'
  }, {
    name: 'locked'
  }, {
    name: 'expired'
  }, {
      name: 'password1',
      validators: ['IsRequired']
  }, {
    name: 'password2',
    validators: ['IsRequired']
  }
  ]
};

export default createForm(definition, UserForm);

