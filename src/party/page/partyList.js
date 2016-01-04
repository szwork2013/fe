import React from 'react';

import PageAncestor from 'core/common/page/pageAncestor';
import GridService from 'core/grid/gridService';
import GridCompConnected from 'core/grid/component/gridCompConnected';
import {ZzIconButtonRoute} from 'core/components/toolmenu/toolmenu';

var gridLocation = 'partyAll';

export default class PartyList extends PageAncestor {

  static title = 'All Parties';

  static fetchData(routerParams) {
    console.log("PartyList#fetchData(%s)", gridLocation);
    return GridService.fetchGrids(gridLocation);
  }


  render() {
    return (
        <GridCompConnected gridLocation={gridLocation} gridId={this.props.params.gridId} query={this.props.query}>
        </GridCompConnected>
    );
  }

}
