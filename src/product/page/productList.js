import React from 'react';

import PageAncestor from 'core/common/page/pageAncestor';
import GridService from 'core/grid/service/gridService';
import GridCompConnected from 'core/grid/component/gridCompConnected';

var gridLocation = 'productList';

export default class ProductList extends PageAncestor {

  static title = 'Products';
  static icon = 'cube';

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  };

  static fetchData(routerParams) {
    console.log("ProductList#fetchData(%s)", gridLocation);
    return GridService.fetchGrids(gridLocation);
  }

  render() {
    return (
        <GridCompConnected gridLocation={gridLocation} gridId={this.props.params.gridId} query={this.props.query} />
    );
  }

}
