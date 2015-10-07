import React from 'react';
import {State} from 'react-router';
import reactMixin from 'react-mixin';

import PageAncestor from 'core/common/page/pageAncestor';
import GridService from 'core/grid/service/gridService';
import GridCompConnected from 'core/grid/component/gridCompConnected';

var gridLocation = 'vehicleList';

@reactMixin.decorate(State)
export default class VehicleList extends PageAncestor {

  static title = 'Vehicles';
  static icon = 'truck';

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  };

  static fetchData(routerParams) {
    console.log("VehicleList#fetchData(%s)", gridLocation);
    return GridService.fetchGrids(gridLocation);
  }

  render() {
    return (
        <GridCompConnected gridLocation={gridLocation} gridId={this.props.params.gridId} query={this.props.query} />
    );
  }

}
