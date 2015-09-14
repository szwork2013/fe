import React from 'react';
import {State} from 'react-router';
import reactMixin from 'react-mixin';
import When from 'when';

import PageAncestor from 'core/common/page/pageAncestor';
import GridService from 'core/grid/service/gridService';
import GridCompConnected from 'core/grid/component/gridCompConnected';

@reactMixin.decorate(State)
export default class PartyList extends PageAncestor {

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  }

  static fetchData(routerParams) {
    console.log("PartyList#fetchData(%o)", routerParams);
    return GridService.fetchGrids('partyList');
  }



  render() {

    return (

        <GridCompConnected gridLocation="partyList" gridId={this.props.params.gridId} query={this.props.query} />



    );
  }

}

//reactMixin(PartyList.prototype, State);


