import React from 'react';

import PageAncestor from 'core/common/page/pageAncestor';
import GridService from 'core/grid/gridService';
import GridCompConnected from 'core/grid/component/gridCompConnected';
import {ZzIconButtonRoute} from 'core/components/toolmenu/toolmenu';


var gridLocation = 'invoiceList';

export default class InvoiceList extends PageAncestor {

  static title = 'Invoices';
  static icon = 'money';


  static fetchData(routerParams) {
    console.log("InvoiceList#fetchData(%s)", gridLocation);
    return GridService.fetchGrids(gridLocation);
  }


  render() {
    return (
      <GridCompConnected gridLocation={gridLocation} gridId={this.props.params.gridId} query={this.props.query}>
        <ZzIconButtonRoute tooltip="New Invoice" fontIcon="fa fa-money"  routeName="invoiceDetail" params={{id: 'new'}} />
      </GridCompConnected>
    );
  }

}
