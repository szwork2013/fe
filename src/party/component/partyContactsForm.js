import React from 'react';
import {get} from 'lodash';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {List, ListItem, ListDivider, Styles, TextField, FontIcon, IconButton, FloatingActionButton} from 'material-ui';

import CommunicationChatBubble from 'material-ui/lib/svg-icons/communication/chat-bubble';

import createForm from 'core/form/createForm';
import StyledSelect from 'core/components/styledSelect/styledSelect';


const Colors = Styles.Colors;

class PartyContactsForm extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate;



  render() {

    const {dataObject, entity, entities, fields: {
      fullName
      }} = this.props;

    // <IconButton iconClassName="fa fa-trash" tooltip="Delete" iconStyle={{fontSize:16, color: Colors.red900}} onClick={ e => {console.log('delete');} } />

    return (

      <div>
        <List subheader="Contacts" subheaderStyle={{lineHeight: '14px', marginTop: 14}}>

          {
            dataObject.contacts.map( contact => {

              const PartyContactType = entities.get('PartyContactType');
              let typeLov = PartyContactType.lovItems.find(lov => lov.value === contact.contactType);

              const PARTYCONTACTCATEGORY = entities.get('PARTYCONTACTCATEGORY');
              let catLov = PARTYCONTACTCATEGORY.lovItems.find(lov => lov.value === get(typeLov, 'params[0]'));

              return (
                <ListItem key={contact.partyContactId} style={{fontSize:14, lineHeight: '14px'}} innerDivStyle={{paddingBottom: 0}}
                  leftIcon={<FontIcon className={get(catLov, 'params[0]')} color={Colors.indigo500} style={{fontSize:16}}  />}
                  primaryText={contact.value}
                  secondaryText={get(typeLov, 'label')}/>
              );
              }
            )
          }

          <FloatingActionButton iconClassName="fa fa-plus" mini={true} style={{float:'right', marginRight:20}} />

        </List>
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

export default createForm(definition, PartyContactsForm);

