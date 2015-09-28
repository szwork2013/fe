import React from 'react';
import {State} from 'react-router';
import reactMixin from 'react-mixin';

import PageAncestor from 'core/common/page/pageAncestor';
import GridService from 'core/grid/service/gridService';
import GridCompConnected from 'core/grid/component/gridCompConnected';

var gridLocation = 'partySalesReps';

@reactMixin.decorate(State)
export default class SalesRepList extends PageAncestor {

  static title = 'Sales Representative';
  static icon = 'male';

  static fetchData(params) {
    console.log("SalesRepList#fetchData(%s)", gridLocation);
    return GridService.fetchGrids(gridLocation);
  }


  render() {
    return (
      <GridCompConnected gridLocation={gridLocation} gridId={this.props.params.gridId} query={this.props.query} />
    );
  }

}



