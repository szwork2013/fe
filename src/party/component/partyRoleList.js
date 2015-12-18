import React from 'react';
import {get, pull, includes} from 'lodash';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Styles, TextField, FontIcon, FloatingActionButton} from 'material-ui';

import createForm from 'core/form/createForm';
import StyledSelect from 'core/components/styledSelect/styledSelect';
import BlockComp from 'core/components/blockComp/blockComp';
import ActiveItem from 'core/components/blockComp/activeItem';

const Colors = Styles.Colors;

export default class PartyRoleList extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  static propTypes = {
    partyObject: React.PropTypes.object.isRequired,
    entities: React.PropTypes.object.isRequired,
    setPartyAction: React.PropTypes.func.isRequired
  };

  addRole = () => {
    console.debug('addRole');
    const {partyObject, setPartyAction} = this.props;
    let newRole = {$open: true};
    partyObject.roles.push(newRole);
    setPartyAction(partyObject);
  };



  render() {

    const {partyObject, entities, setPartyAction} = this.props;

    return (
      <BlockComp header="Roles" style={{display: 'flex', flexDirection: 'column'}}>

        {
          partyObject.roles.map((role, index, array) => <PartyRoleForm dataObject={role} rootObject={partyObject} key={index}
                                                                         entities={entities} entity={entities.get('PartyRole')}
                                                                         setDataAction={setPartyAction} lastValue={(array.length === index + 1)} index={index} /> )
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
    pull(this.props.rootObject.roles, this.props.dataObject);
    this.props.setDataAction(this.props.rootObject);
  };


  render() {



    const {dataObject, rootObject, lastValue, index, entities, fields: {
      roleType
      }} = this.props;

    const PartyRoleType = entities.get('PartyRoleType');
    let typeLov = PartyRoleType.getLovItem(dataObject.roleType);

    // vyhazu ze option selectu role ktere uz na customerovi existuji, krome te me co zrovna edituji
    let roleTypeArray = rootObject.roles.map(role => role.roleType);
    roleType.options = roleType.options.filter(lov => !includes(roleTypeArray, lov.value) || roleType.value === lov.value );

    const openContent = (
      <div>
          <StyledSelect {...roleType}/>
      </div>
    );

    const closedContent = (
      <div style={{fontSize: 14, lineHeight: '14px', cursor: 'pointer', minHeight: 20}}>
        {get(typeLov, 'label')}
      </div>
    );

    return (
      <ActiveItem openContent={openContent} closedContent={closedContent} key={index} lastValue={lastValue} onDelete={this.onDelete} tabIndex={0} {...this.props} />
    );
  }
}

const definition = {
  form: 'PartyRoleForm',
  fields: [{
    name: 'roleType'
  }]
};

PartyRoleForm = createForm(definition, PartyRoleForm);

