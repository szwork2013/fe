import React from 'react';
import {get, pull} from 'lodash';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {Styles, TextField, FontIcon, FloatingActionButton} from 'material-ui';

import PartyService from 'party/partyService';
import createForm from 'core/form/createForm';
import StyledSelect from 'core/components/styledSelect/styledSelect';
import BlockComp from 'core/components/blockComp/blockComp';
import ActiveItem from 'core/components/blockComp/activeItem';

const Colors = Styles.Colors;

export default class PartyAddressList extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  static propTypes = {
    partyObject: React.PropTypes.object.isRequired,
    entities: React.PropTypes.object.isRequired,
    setPartyAction: React.PropTypes.func.isRequired
  };

  addAddress = () => {
    console.debug('addAddress');
    const {partyObject, setPartyAction} = this.props;
    let newAddress = {$open: true};
    partyObject.addresses.push(newAddress);
    setPartyAction(partyObject);
  };



  render() {

    const {partyObject, entities, setPartyAction} = this.props;

    return (
      <BlockComp header="Addresses" style={{display: 'flex', flexDirection: 'column'}}>

        {
          partyObject.addresses.map((address, index, array) => <PartyAddressForm dataObject={contact} rootObject={partyObject} key={index}
                                                                         entities={entities} entity={entities.get('Address')}
                                                                         setDataAction={setPartyAction} lastValue={(array.length === index + 1)} index={index} /> )
        }

        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <FloatingActionButton iconClassName="fa fa-plus" mini={true} onClick={this.addAddress} />
        </div>

      </BlockComp>
    );
  }
}


class PartyAddressForm extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  onDelete = (evt) => {
    evt.stopPropagation();
    console.log('onDelete %o', this.props.dataObject);
    pull(this.props.rootObject.addresses, this.props.dataObject);
    this.props.setDataAction(this.props.rootObject);
  };


  render() {



    const {dataObject, rootObject, lastValue, index, entities, fields: {
      addressType, name, street
      }} = this.props;

    const ADDRESSTYPE = entities.get('ADDRESSTYPE');
    let typeLov = ADDRESSTYPE.getLovItem(dataObject.addressType);

    const Country = entities.get('Country');

    const openContent = (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <StyledSelect {...addressType}/>
          <TextField {...name}   />
        </div>
        <TextField {...street}/>
      </div>
    );

    const closedContent = (
      <div style={{display: 'flex', fontSize: 14, lineHeight: '14px', cursor: 'pointer'}}>
        <FontIcon className="fa fa-envelope-o" color={get(typeLov, 'params[0]')} style={{fontSize:16}}/>
        <div style={{display: 'flex', flexDirection: 'column', marginLeft: '20'}}>
          { (dataObject.name) ? <div>{dataObject.name}</div> : ''}
          <div>{PartyService.addressLine(dataObject, Country)}</div>
          { (dataObject.toHands || dataObject.comment) ? (
            <div style={{fontSize:12, color: Colors.grey500, marginTop: 2}}>
              {  [((dataObject.toHands)? ('To hands: ' + dataObject.toHands) : ''), dataObject.comment].filter(v => v).join(', ') }
            </div>) : ''}
        </div>
      </div>
    );

    return (
      <ActiveItem openContent={openContent} closedContent={closedContent} key={index} lastValue={lastValue} onDelete={this.onDelete} tabIndex={0} {...this.props} />
    );
  }
}

const definition = {
  form: 'PartyAddressForm',
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

PartyAddressForm = createForm(definition, PartyAddressForm);

