import React from 'react';

import PageAncestor from 'core/common/page/pageAncestor';
import GridService from 'core/grid/gridService';
import GridCompConnected from 'core/grid/component/gridCompConnected';

var gridLocation = 'entityList';

export default class EntityList extends PageAncestor {

  static title = 'Entities';
  static icon = 'cogs';

  static fetchData(routerParams) {
    console.log("EntityList#fetchData(%s)", gridLocation);
    return GridService.fetchGrids(gridLocation);
  }


  render() {
    return (
        <GridCompConnected gridLocation={gridLocation} gridId={this.props.params.gridId} query={this.props.query} />
    );
  }

}
