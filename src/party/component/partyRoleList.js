import React from 'react';
import {get, pull, includes} from 'lodash';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Styles, TextField, FontIcon, FloatingActionButton} from 'material-ui';

import createForm from 'core/form/createForm';
import StyledSelect from 'core/components/styledSelect/styledSelect';
import BlockComp from 'core/components/blockComp/blockComp';
import ActiveItem from 'core/components/blockComp/activeItem';
import {Validate} from 'core/form/validate';

const Colors = Styles.Colors;

export default class PartyRoleList extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  static propTypes = {
    partyObject: React.PropTypes.object.isRequired,
    rootObject: React.PropTypes.object.isRequired,
    entities: React.PropTypes.object.isRequired,
    setDataAction: React.PropTypes.func.isRequired
  };

  addRole = () => {
    console.debug('addRole');
    const {partyObject, setDataAction, rootObject} = this.props;
    let newRole = {$new: true};
    partyObject.roles.push(newRole);
    setDataAction(rootObject);
  };



  render() {

    const {partyObject, rootObject, entities, setDataAction} = this.props;

    return (
      <BlockComp header="Roles" style={{display: 'flex', flexDirection: 'column'}}>

        {
          partyObject.roles.map((role, index, array) => <PartyRoleForm dataObject={role} containerObject={partyObject} rootObject={rootObject} key={index}
                                                                         entities={entities} entity={entities.get('PartyRole')}
                                                                         setDataAction={setDataAction} lastValue={(array.length === index + 1)} index={index} /> )
        }

        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <FloatingActionButton iconClassName="fa fa-plus" mini={true} secondary={true} onClick={this.addRole} />
        </div>

      </BlockComp>
    );
  }
}


class PartyRoleForm extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  onDelete = (evt) => {
    evt.stopPropagation();
    console.log('onDelete %o', this.props.dataObject);
    pull(this.props.containerObject.roles, this.props.dataObject);
    this.props.setDataAction(this.props.rootObject);
  };


  render() {



    const {dataObject, rootObject, containerObject, lastValue, index, entities} = this.props;
    let {roleType} = dataObject.$forms[definition.formName].fields;


    const PartyRoleType = entities.get('PartyRoleType');
    let typeLov = PartyRoleType.getLovItem(dataObject.roleType);

    // vyhazu ze option selectu role ktere uz na customerovi existuji, krome te me co zrovna edituji
    let roleTypeArray = containerObject.roles.map(role => role.roleType);
    roleType.props.options = roleType.props.options.filter(lov => !includes(roleTypeArray, lov.value) || roleType.props.value === lov.value );

    const openContent = (
      <div>
          <StyledSelect {...roleType.props}/>
          <Validate field={roleType} value={roleType.props.value}/>
      </div>
    );

    const closedContent = (
      <div style={{fontSize: 14, lineHeight: '14px', cursor: 'pointer', minHeight: 20}}>
        {get(typeLov, 'label')}
      </div>
    );

    return (
      <ActiveItem openContent={openContent} closedContent={closedContent} key={index} lastValue={lastValue} onDelete={this.onDelete} validate={this.props.validate} tabIndex={0} {...this.props} />
    );
  }
}

const definition = {
  formName: 'PartyRoleForm',
  fields: [{
    name: 'roleType',
    validators: ['IsRequired']
  }]
};

PartyRoleForm = createForm(definition, PartyRoleForm);

