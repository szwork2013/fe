import React from 'react';
import {Record, List} from 'immutable';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {TextField, RaisedButton, SelectField} from 'material-ui';
import { Alert } from 'react-bootstrap';

import createForm from 'core/form/createForm';
import {showForTenant} from 'core/form/formUtils';
import StyledSelect from 'core/components/styledSelect/styledSelect';
import BlockComp from 'core/components/blockComp/blockComp';

class PartyPoForm extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {

    const {fields: {
      fullName, ico, dic, icoDph, defaultCurrency, defaultLanguage, defaultPaymentCond, legalForm, naceCode, marketingSource, nationality, taxDomicile
      }
      } = this.props;

    console.log("PartyPoForm.render() : ", fullName);

    return (

      <BlockComp>


        {/*  1. row  */}
        <div className="row">
          <div className="col-xs-12">
            <TextField {...fullName} />
          </div>
        </div>

        {/*  2. row  */}
        <div className="row">
          <div className="col-xs-6 col-sm-4">
            <TextField {...ico} />
          </div>
          <div className="col-xs-6 col-sm-4">
            <TextField {...dic} />
          </div>
          {showForTenant(
            (<div className="col-xs-6 col-sm-4">
              <TextField {...icoDph} />
            </div>), 2)}
        </div>

        {/*  3. 4. 6. row  */}
        <div className="row">
          <div className="col-xs-6 col-sm-4">
            <StyledSelect {...defaultCurrency}  />
          </div>
          <div className="col-xs-6 col-sm-4">
            <StyledSelect {...defaultLanguage}  />
          </div>
          <div className="col-xs-6 col-sm-4">
            <StyledSelect {...defaultPaymentCond}  />
          </div>

          <div className="col-xs-6 col-sm-4">
            <StyledSelect {...legalForm}  />
          </div>
          <div className="col-xs-6 col-sm-4">
            <StyledSelect {...naceCode}  />
          </div>
          <div className="col-xs-6 col-sm-4">
            <StyledSelect {...marketingSource}  />
          </div>

          <div className="col-xs-6 col-sm-4">
            <StyledSelect {...nationality}  />
          </div>
          <div className="col-xs-6 col-sm-4">
            <StyledSelect {...taxDomicile} />
          </div>
        </div>


      </BlockComp>

    );
  }
}

const definition = {
  form: 'PartyPoForm',
  fields: [{
    name: 'fullName',
    validators: ['required']
  }, {
    name: 'ico',
    style: {fontWeight: 'bold'}
  }, {
    name: 'dic'
  }, {
    name: 'icoDph'
  }, {
    name: 'defaultCurrency'
  }, {
    name: 'defaultLanguage'
  }, {
    name: 'defaultPaymentCond'
  }, {
    name: 'legalForm'
  }, {
    name: 'naceCode'
  }, {
    name: 'marketingSource'
  }, {
    name: 'nationality'
  }, {
    name: 'taxDomicile'
  }]
};

export default createForm(definition, PartyPoForm);

