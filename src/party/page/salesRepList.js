import React from 'react';
import {State} from 'react-router';
import reactMixin from 'react-mixin';

import PageAncestor from 'core/common/page/pageAncestor';
import GridService from 'core/grid/gridService';
import GridCompConnected from 'core/grid/component/gridCompConnected';
import {ZzIconButtonRoute} from 'core/components/toolmenu/toolmenu';


var gridLocation = 'partySalesReps';

@reactMixin.decorate(State)
export default class SalesRepList extends PageAncestor {

  static title = 'Sales Representative';
  static icon = 'child';

  static fetchData(params) {
    console.log("SalesRepList#fetchData(%s)", gridLocation);
    return GridService.fetchGrids(gridLocation);
  }


  render() {
    return (
      <GridCompConnected gridLocation={gridLocation} gridId={this.props.params.gridId} query={this.props.query} >
        <ZzIconButtonRoute tooltip="New Sales Representative" fontIcon="fa fa-user-plus"  routeName="partyDetail" params={{id: 'new'}} query={{partyCategory: 'FO', roles:3}} />
      </GridCompConnected>
    );
  }

}



