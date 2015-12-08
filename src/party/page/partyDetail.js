import React from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {uniq,values} from 'lodash';
import When from 'when';
import { connect } from 'react-redux';

import hoistNonReactStatics from 'core/common/utils/hoistNonReactStatics';
import PageAncestor from 'core/common/page/pageAncestor';
import {store} from 'core/common/redux/store';
import MdEntityService from 'core/metamodel/mdEntityService';
import PartyService from 'party/partyService';
import {setPartyAction} from 'party/partyActions';
import PartyFoForm from 'party/component/PartyFoForm';
import PartyPoForm from 'party/component/PartyPoForm';




class PartyDetail extends PageAncestor {
  shouldComponentUpdate = shouldPureComponentUpdate;

  static title = 'Customers';
  static icon = 'user';

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  };

  static fetchData(routerParams, query) {
    console.log("PartyDetail#fetchData()");

    return MdEntityService.fetchEntities(['Party'], [false])
      .then(entityMap => {
        let Party = entityMap.get('Party');
        console.debug(Party);
        let valuesSources = uniq(values(Party.fields).filter(f => f.hasLocalValueSource()).map(f => f.valueSource));

        return MdEntityService.fetchEntities(valuesSources, valuesSources.map(v => true));
      })
      .then((entityMap) => {
        var partyPromise = (routerParams.id === 'new') ? When(Object.assign({}, query)) : PartyService.readParty(routerParams.id);
        return partyPromise.then(partyObject => store.dispatch(setPartyAction(partyObject)));
      });
  }

  onSubmit = (evt) => {
    console.log('onSubmit');
  };



  render() {

    const {
      partyObject,
      partyEntity,
      setPartyAction
      } = this.props;

    return (

      <main className="main-content">

        <form onSubmit={ e => this.onSubmit(e)} >
          <div className="container-fluid">
            <div className="row">
              { this.mainForm(partyObject, partyEntity, setPartyAction) }
            </div>
          </div>
        </form>




      </main>

    );
  }

  mainForm = (partyObject, partyEntity, setPartyAction) => {
    const props = {dataObject: partyObject, entity: partyEntity, setDataAction: setPartyAction};
    switch (partyObject.partyCategory) {
      case 'PO':
        return <PartyPoForm {...props} /> ;
      case 'FO':
        return <PartyFoForm {...props} /> ;
    }
  }

}

function mapStateToProps(state) {
  return {
    partyObject: state.getIn(['party', 'partyObject']),
    partyEntity: state.getIn(['metamodel', 'entities', 'Party'])
  };
}

export default hoistNonReactStatics(connect(mapStateToProps, {setPartyAction})(PartyDetail), PartyDetail);


