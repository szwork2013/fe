import React from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {uniq, values} from 'lodash';
import When from 'when';
import { connect } from 'react-redux';
import { FlatButton, Styles} from 'material-ui';

import hoistNonReactStatics from 'core/common/utils/hoistNonReactStatics';
import PageAncestor from 'core/common/page/pageAncestor';
import Toolmenu from 'core/components/toolmenu/toolmenu';
import {store} from 'core/common/redux/store';
import MdEntityService from 'core/metamodel/mdEntityService';
import PartyService from 'party/partyService';
import {setPartyAction} from 'party/partyActions';

import PartyFoForm from 'party/component/partyFoForm';
import PartyPoForm from 'party/component/partyPoForm';
import PartyContactList from 'party/component/partyContactList';
import PartyRoleList from 'party/component/partyRoleList';
import PartyAddressList from 'party/component/partyAddressList';

import BlockComp from 'core/components/blockComp/blockComp';


class PartyDetail extends PageAncestor {
  shouldComponentUpdate = shouldPureComponentUpdate;

  static title = 'Customer';
  static icon = 'user';

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  };

  static fetchData(routerParams, query) {
    console.log("PartyDetail#fetchData()");

    return MdEntityService.fetchEntityMetadata(['Party', 'PartyContact', 'PartyRole', 'Address'], ['PARTYCONTACTCATEGORY'])
      .then((entityMap) => {
        var partyPromise = (routerParams.id === 'new') ? When(Object.assign({contacts: [], addresses: [], roles: []}, query)) : PartyService.readParty(routerParams.id);
        return partyPromise.then(partyObject => store.dispatch(setPartyAction(partyObject)));
      });
  }

  onSave = (evt) => {
    console.log('onSave');
  };
  onDelete = (evt) => {
    console.log('onDelete');
  };
  onBack = (evt) => {
    console.log('onBack');
    this.context.router.goBack();
  };



  render() {

    const {
      partyObject,
      entities,
      setPartyAction
      } = this.props;

    const propsForCreateForm = {dataObject: partyObject, rootObject: partyObject, entity: entities.get('Party'), entities, setDataAction: setPartyAction};

    return (

      <main className="main-content">
        {this._createToolMenu(partyObject)}
        <form style={{marginTop: 10}}>
          <div className="row">
            <div className="col-xs-12 col-lg-6">
                <div className="row">
                  <div className="col-xs-12 col-sm-8">
                    { this._mainForm(partyObject, propsForCreateForm) }
                    <PartyAddressList partyObject={partyObject} entities={entities} setPartyAction={setPartyAction} />
                  </div>
                  <div className="col-xs-12 col-sm-4">
                    <PartyContactList partyObject={partyObject} entities={entities} setPartyAction={setPartyAction} />
                    <PartyRoleList partyObject={partyObject} entities={entities} setPartyAction={setPartyAction} />
                  </div>
                </div>
            </div>
          </div>
        </form>




      </main>

    );
  }

  _mainForm = (partyObject, propsForCreateForm) => {

    switch (partyObject.partyCategory) {
      case 'PO':
        return <PartyPoForm {...propsForCreateForm} /> ;
      case 'FO':
        return <PartyFoForm {...propsForCreateForm} /> ;
    }
  };



  _createToolMenu(partyObject) {
    return (
      <Toolmenu>
          <FlatButton onClick={this.onSave}>
            <span className="fa fa-save"/><span> Save customer</span>
          </FlatButton>
        { (partyObject.partyId > 0) ? (
          <FlatButton onClick={this.onDelete}>
            <span className="fa fa-trash"/><span> Delete Customer</span>
          </FlatButton>
        ) : <div/>}
        <FlatButton onClick={this.onBack}>
          <span className="fa fa-chevron-left"/><span> Back</span>
        </FlatButton>
      </Toolmenu>
    );
  }


}

function mapStateToProps(state) {
  return {
    partyObject: state.getIn(['party', 'partyObject']),
    entities: state.getIn(['metamodel', 'entities'])
  };
}

export default hoistNonReactStatics(connect(mapStateToProps, {setPartyAction})(PartyDetail), PartyDetail);


