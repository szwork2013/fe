import React from 'react';

import PageAncestor from 'core/common/page/pageAncestor';
import GridService from 'core/grid/gridService';
import GridCompConnected from 'core/grid/component/gridCompConnected';

var gridLocation = 'gridLocationList';

export default class GridLocationList extends PageAncestor {

  static title = 'Grids';
  static icon = 'table';

  static fetchData(routerParams) {
    console.log("GridLocationList#fetchData(%s)", gridLocation);
    return GridService.fetchGrids(gridLocation);
  }


  render() {
    return (
        <GridCompConnected gridLocation={gridLocation} gridId={this.props.params.gridId} query={this.props.query} />
    );
  }

}
