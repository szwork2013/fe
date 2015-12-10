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
import InvoiceService from 'invoicing/invoiceService';
import {setInvoiceAction} from 'invoicing/invoiceActions';

import PartyFoForm from 'party/component/partyFoForm';
import PartyPoForm from 'party/component/partyPoForm';
import PartyContactsForm from 'party/component/partyContactsForm';



class InvoiceDetail extends PageAncestor {
  shouldComponentUpdate = shouldPureComponentUpdate;

  static title = 'Invoice';
  static icon = 'money';

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  };

  static fetchData(routerParams, query) {
    console.log("InvoiceDetail#fetchData()");

    return MdEntityService.fetchEntities(['Invoice', 'InvoiceItem'], [false])
      .then(entityMap => {
        let Party = entityMap.get('Party');

        let allFields = values(entityMap.get('Invoice').fields).concat(
          values(entityMap.get('InvoiceItem').fields));

        let allValueSources = allFields.filter(f => f.hasLocalValueSource()).map(f => f.valueSource);
        let valuesSources = uniq(allValueSources);

        return MdEntityService.fetchEntities(valuesSources, valuesSources.map(v => true));
      })
      .then((entityMap) => {
        var invoicePromise = (routerParams.id === 'new') ? When(Object.assign({items: []}, query)) : InvoiceService.readInvoice(routerParams.id);
        return invoicePromise.then(invoiceObject => store.dispatch(setInvoiceAction(invoiceObject)));
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
      invoiceObject,
      invoiceEntity,
      entities,
      setInvoiceAction
      } = this.props;

    const propsForCreateForm = {dataObject: invoiceObject, entity: invoiceEntity, entities, setDataAction: setInvoiceAction};

    return (

      <main className="main-content">
        {this._createToolMenu(invoiceObject)}
        <form style={{marginTop: 10}}>
          <div className="row">
            <div className="col-xs-12">
                TODO
            </div>
          </div>
        </form>




      </main>

    );
  }



  _createToolMenu(invoiceObject) {
    return (
      <Toolmenu>
          <FlatButton onClick={this.onSave}>
            <span className="fa fa-save"/><span> Save Invoice</span>
          </FlatButton>
        { (partyObject.partyId > 0) ? (
          <FlatButton onClick={this.onDelete}>
            <span className="fa fa-trash"/><span> Delete Invoice</span>
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
    partyObject: state.getIn(['invoice', 'invoiceObject']),
    invoiceEntity: state.getIn(['metamodel', 'entities', 'Invoice']),
    entities: state.getIn(['metamodel', 'entities'])
  };
}

export default hoistNonReactStatics(connect(mapStateToProps, {setInvoiceAction})(InvoiceDetail), InvoiceDetail);


