import React from 'react';
import {Record, List} from 'immutable';
import {get} from 'lodash';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {TextField, RaisedButton, SelectField, Checkbox} from 'material-ui';
import { Alert } from 'react-bootstrap';

import createForm from 'core/form/createForm';
import {FieldText} from 'core/form/formUtils';
import StyledSelect from 'core/components/styledSelect/styledSelect';
import BlockComp from 'core/components/blockComp/blockComp';
import ActiveItem from 'core/components/blockComp/activeItem';
import {composedParty} from 'party/partyUtils';

class UserForm extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  render() {



    let {dataObject, rootObject, lastValue,  entities, fields: {
      username, firstName, lastName, enabled, locked, expired
      }} = this.props;

    //let enhancedParty = composedParty(dataObject, entities);

    let openContent = (
      <div>

        {/*  1. row  */}
        <div className="row">
          <div className="col-xs-6 col-sm-4">
            <TextField {...username} />
          </div>
          <div className="col-xs-6 col-sm-4">
            <TextField {...firstName} />
          </div>
          <div className="col-xs-6 col-sm-4">
            <TextField {...lastName} />
          </div>
        </div>

        {/*  2. row  */}
        <div className="row">
          <div className="col-xs-6 col-sm-4">
            <Checkbox {...enabled} />
          </div>
          <div className="col-xs-6 col-sm-4">
            <Checkbox {...locked} />
          </div>
          <div className="col-xs-6 col-sm-4">
            <Checkbox {...expired} />
          </div>
        </div>

      </div>
    );


    let closedContent = (
      <div style={{display: 'flex', flexDirection: 'column', cursor: 'pointer'}}>

        <h5 style={{marginTop: 0, fontSize: '18px', fontWeight: 'bold'}}>{dataObject.username}</h5>


      </div>
    );


    return (
      <BlockComp>
        <ActiveItem openContent={openContent} closedContent={closedContent} lastValue={true} tabIndex={0} {...this.props} />
      </BlockComp>
    );
  }
}

const definition = {
  form: 'UserForm',
  fields: [{
    name: 'username',
    validators: ['required']
  },{
    name: 'firstName',
    fieldPath: 'partyObject.firstName'
  },{
    name: 'lastName',
    fieldPath: 'partyObject.lastName'
  },{
    name: 'enabled'
  }, {
    name: 'locked'
  }, {
    name: 'expired'
  }
  ]
};

export default createForm(definition, UserForm);

