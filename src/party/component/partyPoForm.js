import React from 'react';
import {Record, List} from 'immutable';
import {get} from 'lodash';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {TextField, RaisedButton, SelectField} from 'material-ui';
import { Alert } from 'react-bootstrap';

import createForm from 'core/form/createForm';
import {showForTenant, FieldText} from 'core/form/formUtils';
import StyledSelect from 'core/components/styledSelect/styledSelect';
import BlockComp from 'core/components/blockComp/blockComp';
import ActiveItem from 'core/components/blockComp/activeItem';
import {composedParty} from 'party/partyUtils';

class PartyPoForm extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  render() {



    let {dataObject, rootObject, lastValue,  entities, fields: {
      fullName, ico, dic, icoDph, defaultCurrency, defaultLanguage, defaultPaymentCond, legalForm, naceCode, marketingSource, nationality, taxDomicile
      }} = this.props;

    let enhancedParty = composedParty(dataObject, entities);

    let openContent = (
      <div>

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

      </div>
    );


    let closedContent = (
      <div style={{display: 'flex', flexDirection: 'column', cursor: 'pointer'}}>

        <h5 style={{marginTop: 0, fontSize: '18px', fontWeight: 'bold'}}>{dataObject.fullName}</h5>

        <div className="form-text-row">
          <FieldText label={ico.textLabel} value={dataObject.ico}/>
          <FieldText label={dic.textLabel} value={dataObject.dic}/>
          {showForTenant(<FieldText label={icoDph.textLabel} value={dataObject.icoDph}/>, 2)}
        </div>

        <div className="form-text-row">
          <FieldText label={defaultCurrency.textLabel} value={dataObject.defaultCurrency}/>
          <FieldText label={defaultLanguage.textLabel} value={dataObject.defaultLanguageLabel}/>
          <FieldText label={defaultPaymentCond.textLabel} value={dataObject.defaultPaymentCondLabel}/>
          <FieldText label={legalForm.textLabel} value={dataObject.legalFormLabel}/>
          <FieldText label={naceCode.textLabel} value={dataObject.naceCodeLabel}/>
          <FieldText label={marketingSource.textLabel} value={dataObject.marketingSourceLabel}/>
          <FieldText label={nationality.textLabel} value={dataObject.nationalityLabel}/>
          <FieldText label={taxDomicile.textLabel} value={dataObject.taxDomicileLabel}/>
        </div>


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
  form: 'PartyPoForm',
  fields: [{
    name: 'fullName',
    validators: ['required']
  }, {
    name: 'ico'
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

