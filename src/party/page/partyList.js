import React from 'react';
import {State} from 'react-router';
import reactMixin from 'react-mixin';


import PageAncestor from 'core/common/page/pageAncestor';
import GridService from 'core/grid/service/gridService';
import GridCompConnected from 'core/grid/component/gridCompConnected';
import {ZzIconButtonRoute} from 'core/components/toolmenu/toolmenu';

var gridLocation = 'partyCustomers';

@reactMixin.decorate(State)
export default class PartyList extends PageAncestor {

  static title = 'Customers';
  static icon = 'user';

  static fetchData(routerParams) {
    console.log("PartyList#fetchData(%s)", gridLocation);
    return GridService.fetchGrids(gridLocation);
  }



  render() {
    return (
        <GridCompConnected gridLocation={gridLocation} gridId={this.props.params.gridId} query={this.props.query}>
            <ZzIconButtonRoute tooltip="New Customer" fontIcon="fa fa-user-plus"  routeName="partyDetail" params={{id: 'new'}} query={{partyCategory: 'PO'}} />
        </GridCompConnected>
    );
  }

}
