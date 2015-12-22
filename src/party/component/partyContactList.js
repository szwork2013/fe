import React from 'react';
import {get, pull} from 'lodash';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Styles, TextField, FontIcon, FloatingActionButton} from 'material-ui';

import createForm from 'core/form/createForm';
import StyledSelect from 'core/components/styledSelect/styledSelect';
import BlockComp from 'core/components/blockComp/blockComp';
import ActiveItem from 'core/components/blockComp/activeItem';

const Colors = Styles.Colors;

export default class PartyContactList extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  static propTypes = {
    partyObject: React.PropTypes.object.isRequired,
    rootObject: React.PropTypes.object.isRequired,
    entities: React.PropTypes.object.isRequired,
    setDataAction: React.PropTypes.func.isRequired
  };

  addContact = () => {
    console.debug('addContact');
    const {partyObject, setDataAction, rootObject} = this.props;
    let newContact = {$open: true};
    partyObject.contacts.push(newContact);
    setDataAction(rootObject);
  };



  render() {

    const {partyObject, entities, setDataAction, rootObject} = this.props;

    return (
      <BlockComp header="Contacts" style={{display: 'flex', flexDirection: 'column'}}>

        {
          partyObject.contacts.map((contact, index, array) => <PartyContactForm dataObject={contact} containerObject={partyObject} rootObject={rootObject} key={index}
                                                                         entities={entities} entity={entities.get('PartyContact')}
                                                                         setDataAction={setDataAction} lastValue={(array.length === index + 1)} index={index} /> )
        }

        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <FloatingActionButton iconClassName="fa fa-plus" mini={true} secondary={true} onClick={this.addContact} />
        </div>

      </BlockComp>
    );
  }
}


class PartyContactForm extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  onDelete = (evt) => {
    evt.stopPropagation();
    console.log('onDelete %o', this.props.dataObject);
    pull(this.props.containerObject.contacts, this.props.dataObject);
    this.props.setDataAction(this.props.rootObject);
  };


  render() {



    const {dataObject, rootObject, lastValue, index, entities, fields: {
      value, comment, contactType
      }} = this.props;

    const PartyContactType = entities.get('PartyContactType');
    let typeLov = PartyContactType.getLovItem(dataObject.contactType);

    const PARTYCONTACTCATEGORY = entities.get('PARTYCONTACTCATEGORY');
    let catLov = PARTYCONTACTCATEGORY.getLovItem(get(typeLov, 'params[0]'));


    const openContent = (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <TextField {...value}   />
          <StyledSelect {...contactType}/>
        </div>
        <TextField {...comment}/>
      </div>
    );

    const closedContent = (
      <div style={{display: 'flex', fontSize: 14, lineHeight: '14px', cursor: 'pointer'}}>
        <FontIcon className={get(catLov, 'params[0]')} color={Colors.indigo500} style={{fontSize:16}}/>
        <div style={{display: 'flex', flexDirection: 'column', marginLeft: '20', wordBreak: 'break-all'}}>
          <div>{dataObject.value}</div>
          <div style={{fontSize:12, color: Colors.grey500, marginTop: 2}}>{get(typeLov, 'label')}</div>
          { (dataObject.comment) ? (
            <div style={{fontSize:12, color: Colors.grey500, marginTop: 2}}>{dataObject.comment}</div>) : ''}
        </div>
      </div>
    );

    return (
      <ActiveItem openContent={openContent} closedContent={closedContent} key={index} lastValue={lastValue} onDelete={this.onDelete} tabIndex={0} {...this.props} />
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

