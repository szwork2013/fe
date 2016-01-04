import React from 'react';

import PageAncestor from 'core/common/page/pageAncestor';
import GridService from 'core/grid/gridService';
import GridCompConnected from 'core/grid/component/gridCompConnected';
import {ZzIconButtonRoute} from 'core/components/toolmenu/toolmenu';

var gridLocation = 'partyCustomers';

export default class CustomerList extends PageAncestor {

  static title = 'Customers';
  static icon = 'male';

  static fetchData(routerParams) {
    console.log("CustomerList#fetchData(%s)", gridLocation);
    return GridService.fetchGrids(gridLocation);
  }


  render() {
    return (
        <GridCompConnected gridLocation={gridLocation} gridId={this.props.params.gridId} query={this.props.query}>
            <ZzIconButtonRoute tooltip="New Customer" fontIcon="fa fa-user-plus"  routeName="partyDetail" params={{id: 'new'}} query={{partyCategory: 'PO', roles:1}} />
        </GridCompConnected>
    );
  }

}
