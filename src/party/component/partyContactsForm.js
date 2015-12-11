import React from 'react';
import {get} from 'lodash';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {Styles, TextField, FontIcon, FloatingActionButton} from 'material-ui';

import createForm from 'core/form/createForm';
import StyledSelect from 'core/components/styledSelect/styledSelect';
import BlockComp from 'core/components/blockComp/blockComp';
import ActiveItem from 'core/components/blockComp/activeItem';

const Colors = Styles.Colors;

class PartyContactsForm extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate;


  render() {

    const {dataObject, entity, entities, fields: {
      value, comment, contactType
      }} = this.props;

    return (
      <BlockComp header="Contacts" style={{display: 'flex', flexDirection: 'column'}}>

        {
          dataObject.contacts.map( (contact, index) => {

              const PartyContactType = entities.get('PartyContactType');
              let typeLov = PartyContactType.lovItems.find(lov => lov.value === contact.contactType);

              const PARTYCONTACTCATEGORY = entities.get('PARTYCONTACTCATEGORY');
              let catLov = PARTYCONTACTCATEGORY.lovItems.find(lov => lov.value === get(typeLov, 'params[0]'));

              const style = {display: 'flex', fontSize:14, lineHeight: '14px', paddingTop: 10};
              if (dataObject.contacts.length > index + 1) Object.assign(style, {borderBottom: '1px solid', borderBottomColor: Colors.grey300, paddingBottom: 10});

              const openContent = (
                <div>
                  <TextField {...value}/>
                  <TextField {...comment}/>
                  <TextField {...contactType}/>
                </div>
              );

              return (

                <ActiveItem openContent={openContent} key={index} style={style} tabIndex={0}>
                  <FontIcon className={get(catLov, 'params[0]')} color={Colors.indigo500} style={{fontSize:16}}  />
                  <div style={{display: 'flex', flexDirection: 'column', marginLeft: '20'}}>
                    <div>{contact.value}</div>
                    <div style={{fontSize:12, color: Colors.grey500, marginTop: 2}}>{get(typeLov, 'label')}</div>
                    { (contact.comment) ? (<div style={{fontSize:12, color: Colors.grey500, marginTop: 2}}>{contact.comment}</div>) : ''}
                  </div>
                </ActiveItem>

              );
            }
          )
        }

        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <FloatingActionButton iconClassName="fa fa-plus" mini={true} />
        </div>

      </BlockComp>
    );
  }
}

const definition = {
  form: 'PartyContactForm',
  fields: [{
    name: 'value',
    validators: ['required']
  }, {
    name: 'comment'
  }, {
    name: 'contactType'
  }]
};

export default createForm(definition, PartyContactsForm);

