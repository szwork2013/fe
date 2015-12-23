import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {TextField} from 'material-ui';

import createForm from 'core/form/createForm';
import {showForTenant, FieldText} from 'core/form/formUtils';
import StyledSelect from 'core/components/styledSelect/styledSelect';
import StyledDatePicker from 'core/components/styledDatePicker/styledDatePicker';
import BlockComp from 'core/components/blockComp/blockComp';
import ActiveItem from 'core/components/blockComp/activeItem';


class PartyFoForm extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);


  onCommit = (dataObject) => {
    dataObject.fullName = [dataObject.firstName, dataObject.lastName].filter(v=>v).join(' ');
  };

  render() {



    let {dataObject, rootObject, lastValue,  entities, fields: {
      firstName, lastName, titleBefore, dateOfBirth, birthNumber, birthLastName, salutation, placeOfBirth, nationality, taxDomicile, gender
      }} = this.props;


    let openContent = (
      <div>


        {/*  1. row  */}
        <div className="row">
          <div className="col-xs-6 col-sm-4">
            <TextField {...firstName} />
          </div>
          <div className="col-xs-6 col-sm-4">
            <TextField {...lastName} />
          </div>
            <div className="col-xs-6 col-sm-4">
              <TextField {...titleBefore} />
            </div>
        </div>

        {/*  3. 4. 6. row  */}
        <div className="row">
          <div className="col-xs-6 col-sm-4">
            <StyledDatePicker {...dateOfBirth}  />
          </div>
          <div className="col-xs-6 col-sm-4">
            <TextField {...birthNumber}  />
          </div>
          <div className="col-xs-6 col-sm-4">
            <StyledSelect {...gender}  />
          </div>
          <div className="col-xs-6 col-sm-4">
            <TextField {...birthLastName}  />
          </div>

          <div className="col-xs-6 col-sm-4">
            <TextField {...salutation}  />
          </div>
          <div className="col-xs-6 col-sm-4">
            <TextField {...placeOfBirth}  />
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

        <h5 style={{marginTop: 0, fontSize: '18px', fontWeight: 'bold'}}>{[dataObject.titleBefore, dataObject.fullName].filter(v=>v).join(' ')}</h5>

        <div className="form-text-row">
          <FieldText label={dateOfBirth.textLabel} value={dataObject.dateOfBirth} mdField={dateOfBirth.mdField} />
          <FieldText label={birthNumber.textLabel} value={dataObject.birthNumber}/>
          <FieldText label={birthLastName.textLabel} value={dataObject.birthLastName}/>
          <FieldText label={salutation.textLabel} value={dataObject.salutation}/>
          <FieldText label={placeOfBirth.textLabel} value={dataObject.placeOfBirth}/>
          <FieldText label={nationality.textLabel} value={dataObject.nationalityLabel}/>
          <FieldText label={taxDomicile.textLabel} value={dataObject.taxDomicileLabel}/>
        </div>


      </div>
    );


    return (
      <BlockComp>
        <ActiveItem openContent={openContent} closedContent={closedContent} lastValue={true} onCommit={this.onCommit} tabIndex={0} {...this.props} />
      </BlockComp>
    );
  }
}

const definition = {
  form: 'PartyFoForm',
  fields: [{
    name: 'firstName'
  }, {
    name: 'lastName',
    validators: ['required']
  }, {
    name: 'titleBefore'
  }, {
    name: 'dateOfBirth'
  }, {
    name: 'birthNumber'
  }, {
    name: 'gender'
  }, {
    name: 'birthLastName'
  }, {
    name: 'salutation'
  }, {
    name: 'placeOfBirth'
  }, {
    name: 'nationality'
  }, {
    name: 'taxDomicile'
  }, {
    name: 'fullName'
  }]
};

export default createForm(definition, PartyFoForm);

