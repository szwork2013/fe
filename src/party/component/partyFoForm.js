import React from 'react';
import {Record, List} from 'immutable';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {TextField, RaisedButton, SelectField} from 'material-ui';
import { Alert } from 'react-bootstrap';

import createForm from 'core/form/createForm';

class PartyFoForm extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {

    const {fields: {firstName, lastName}} = this.props;


    return (

      <div className="col-xs-10">


        <div className="row">
          <div className="col-xs-1">
            <TextField {...firstName} />
          </div>
          <div className="col-xs-1">
            <TextField {...lastName} />
          </div>
        </div>

      </div>

    );
  }
}

const definition = {
  form: 'PartyFoForm',
  fields: [{
    name: 'firstName',
    validators: ['required']
  }, {
    name: 'lastName'
  }]
};

export default createForm(definition, PartyFoForm);


