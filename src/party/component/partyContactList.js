import React from 'react';
import {get} from 'lodash';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {Styles, TextField, FontIcon, FloatingActionButton} from 'material-ui';

import createForm from 'core/form/createForm';
import StyledSelect from 'core/components/styledSelect/styledSelect';
import BlockComp from 'core/components/blockComp/blockComp';
import ActiveItem from 'core/components/blockComp/activeItem';

const Colors = Styles.Colors;

export default class PartyContactList extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  static propTypes = {
    partyObject: React.PropTypes.object.isRequired,
    entities: React.PropTypes.object.isRequired,
    setPartyAction: React.PropTypes.func.isRequired
  };

  addContact = () => {
    console.debug('addContact');
    const {partyObject, setPartyAction} = this.props;
    partyObject.contacts.push({$open: true});
    setPartyAction(partyObject);
  };



  render() {

    const {partyObject, entities, setPartyAction} = this.props;

    return (
      <BlockComp header="Contacts" style={{display: 'flex', flexDirection: 'column'}}>

        {
          partyObject.contacts.map((contact, index, array) => <PartyContactForm dataObject={contact} rootObject={partyObject}
                                                                         entities={entities} entity={entities.get('PartyContact')}
                                                                         setDataAction={setPartyAction} lastValue={(array.length === index + 1)} index={index} /> )
        }

        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <FloatingActionButton iconClassName="fa fa-plus" mini={true} onClick={this.addContact} />
        </div>

      </BlockComp>
    );
  }
}


class PartyContactForm extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate;


  render() {



    const {dataObject, lastValue, index, entities, fields: {
      value, comment, contactType
      }} = this.props;

    const PartyContactType = entities.get('PartyContactType');
    let typeLov = PartyContactType.lovItems.find(lov => lov.value === dataObject.contactType);

    const PARTYCONTACTCATEGORY = entities.get('PARTYCONTACTCATEGORY');
    let catLov = PARTYCONTACTCATEGORY.lovItems.find(lov => lov.value === get(typeLov, 'params[0]'));


    const openContent = (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <TextField {...value} />
          <StyledSelect {...contactType}/>
        </div>
        <TextField {...comment}/>
      </div>
    );

    const closedContent = (
      <div style={{display: 'flex', fontSize: 14, lineHeight: '14px'}}>
        <FontIcon className={get(catLov, 'params[0]')} color={Colors.indigo500} style={{fontSize:16}}/>
        <div style={{display: 'flex', flexDirection: 'column', marginLeft: '20'}}>
          <div>{dataObject.value}</div>
          <div style={{fontSize:12, color: Colors.grey500, marginTop: 2}}>{get(typeLov, 'label')}</div>
          { (dataObject.comment) ? (
            <div style={{fontSize:12, color: Colors.grey500, marginTop: 2}}>{dataObject.comment}</div>) : ''}
        </div>
      </div>
    );

    return (
      <ActiveItem openContent={openContent} closedContent={closedContent} key={index} lastValue={lastValue} tabIndex={0} {...this.props} />
    );
  }
}

const definition = {
  form: 'PartyContactForm',
  fields: [{
    name: 'value',
    validators: ['required'],
    style: {marginRight: 5}
  }, {
    name: 'comment'
  }, {
    name: 'contactType'
  }]
};

PartyContactForm = createForm(definition, PartyContactForm);

