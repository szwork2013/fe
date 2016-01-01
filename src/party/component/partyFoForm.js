import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {TextField} from 'material-ui';

import createForm from 'core/form/createForm';
import {showForTenant, FieldText} from 'core/form/formUtils';
import StyledSelect from 'core/components/styledSelect/styledSelect';
import StyledDatePicker from 'core/components/styledDatePicker/styledDatePicker';
import BlockComp from 'core/components/blockComp/blockComp';
import ActiveItem from 'core/components/blockComp/activeItem';
import {Validate} from 'core/form/validate';



class PartyFoForm extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);




  render() {



    let {dataObject, rootObject, lastValue,  entities} = this.props;

    let {firstName, lastName, titleBefore, dateOfBirth, birthNumber, birthLastName, salutation, placeOfBirth, nationality, taxDomicile, gender}
      = dataObject.$forms[definition.formName].fields;

    let openContent = (
      <div>


        {/*  1. row  */}
        <div className="row">
          <div className="col-xs-6 col-sm-4">
            <TextField {...firstName.props} />
          </div>
          <div className="col-xs-6 col-sm-4">
            <TextField  {...lastName.props}/>
            <Validate field={lastName} value={lastName.props.value}/>
          </div>
            <div className="col-xs-6 col-sm-4">
              <TextField {...titleBefore.props} />
            </div>
        </div>

        {/*  3. 4. 6. row  */}
        <div className="row">
          <div className="col-xs-6 col-sm-4">
            <StyledDatePicker {...dateOfBirth.props}  />
          </div>
          <div className="col-xs-6 col-sm-4">
            <TextField {...birthNumber.props}  />
          </div>
          <div className="col-xs-6 col-sm-4">
            <StyledSelect {...gender.props}  />
          </div>
          <div className="col-xs-6 col-sm-4">
            <TextField {...birthLastName.props}  />
          </div>

          <div className="col-xs-6 col-sm-4">
            <TextField {...salutation.props}  />
          </div>
          <div className="col-xs-6 col-sm-4">
            <TextField {...placeOfBirth.props}  />
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

        <h5 style={{marginTop: 0, fontSize: '18px', fontWeight: 'bold'}}>{[dataObject.titleBefore, dataObject.fullName].filter(v=>v).join(' ')}</h5>

        <div className="form-text-row">
          <FieldText label={dateOfBirth.textLabel} value={dataObject.dateOfBirth} mdField={dateOfBirth.mdField} />
          <FieldText label={birthNumber.textLabel} value={dataObject.birthNumber}/>
          <FieldText label={gender.textLabel} value={dataObject.genderLabel}/>
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
        <ActiveItem openContent={openContent} closedContent={closedContent} lastValue={true} validate={this.props.validate} tabIndex={0} {...this.props} />
      </BlockComp>
    );
  }
}

const definition = {
  formName: 'PartyFoForm',
  fields: [{
    name: 'firstName'
  }, {
    name: 'lastName',
    validators: ['IsRequired']
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
  }],
  onCommit(dataObject) {
    dataObject.fullName = [dataObject.firstName, dataObject.lastName].filter(v=>v).join(' ');
  }
};

export default createForm(definition, PartyFoForm);

