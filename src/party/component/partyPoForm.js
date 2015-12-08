import React from 'react';
import {Record, List} from 'immutable';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {TextField, RaisedButton, SelectField} from 'material-ui';
import { Alert } from 'react-bootstrap';

import createForm from 'core/form/createForm';

class PartyPoForm extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {

    const {fields: {firstName, lastName}} = this.props;


    return (

      <div className="col-xs-10">


        <div className="row">
          <div className="col-xs-12">
            <TextField {...fullName} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-4">
            <TextField {...ico} />
          </div>
          <div className="col-xs-4">
            <TextField {...ico} />
          </div>
          <div className="col-xs-4">
            <TextField {...ico} />
          </div>
        </div>

      </div>

    );
  }
}

const definition = {
  form: 'PartyPoForm',
  fields: [{
    name: 'fullName',
    validators: ['required']
  }, {
    name: 'ico'
  }, {
    name: 'ico'
  }, {
    name: 'ico'
  }]
};

export default createForm(definition, PartyPoForm);

