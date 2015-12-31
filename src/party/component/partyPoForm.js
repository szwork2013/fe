import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {TextField} from 'material-ui';

import createForm from 'core/form/createForm';
import {showForTenant, FieldText} from 'core/form/formUtils';
import StyledSelect from 'core/components/styledSelect/styledSelect';
import BlockComp from 'core/components/blockComp/blockComp';
import ActiveItem from 'core/components/blockComp/activeItem';

class PartyPoForm extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  render() {



    let {dataObject, rootObject, lastValue,  entities, fields: {
      fullName, ico, dic, icoDph, defaultCurrency, defaultLanguage, defaultPaymentCond, legalForm, naceCode, marketingSource, nationality, taxDomicile
      }} = this.props;


    let openContent = (
      <div>

        {/*  1. row  */}
        <div className="row">
          <div className="col-xs-12">
            <TextField {...fullName.props} />
          </div>
        </div>

        {/*  2. row  */}
        <div className="row">
          <div className="col-xs-6 col-sm-4">
            <TextField {...ico.props} />
          </div>
          <div className="col-xs-6 col-sm-4">
            <TextField {...dic.props} />
          </div>
          {showForTenant(
            (<div className="col-xs-6 col-sm-4">
              <TextField {...icoDph.props} />
            </div>), 2)}
        </div>

        {/*  3. 4. 6. row  */}
        <div className="row">
          <div className="col-xs-6 col-sm-4">
            <StyledSelect {...defaultCurrency.props}  />
          </div>
          <div className="col-xs-6 col-sm-4">
            <StyledSelect {...defaultLanguage.props}  />
          </div>
          <div className="col-xs-6 col-sm-4">
            <StyledSelect {...defaultPaymentCond.props}  />
          </div>

          <div className="col-xs-6 col-sm-4">
            <StyledSelect {...legalForm.props}  />
          </div>
          <div className="col-xs-6 col-sm-4">
            <StyledSelect {...naceCode.props}  />
          </div>
          <div className="col-xs-6 col-sm-4">
            <StyledSelect {...marketingSource.props}  />
          </div>

          <div className="col-xs-6 col-sm-4">
            <StyledSelect {...nationality.props}  />
          </div>
          <div className="col-xs-6 col-sm-4">
            <StyledSelect {...taxDomicile.props} />
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
        </div>
        <div className="form-text-row">
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
  formName: 'PartyPoForm',
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

