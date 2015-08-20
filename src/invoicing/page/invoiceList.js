import React from 'react';
import {State} from 'react-router';
import reactMixin from 'react-mixin';

import PageAncestor from 'core/common/page/pageAncestor';
import GridService from 'core/grid/service/gridService';


@reactMixin.decorate(State)
export default class InvoiceList extends PageAncestor {

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  }

  static fetchData(params) {
    console.log("InvoiceList#fetchData(%o)", params);
    return GridService.getGridConfigs('invoicing|Invoice');
  }


  render() {
    var name = this.context.router.getCurrentPath();
    var name2 = this.getPath();

    return (
        <h1>Invoice list ! <i className="fa fa-fa-file"></i>
          {name}
          <br/>
          {name2}
        </h1>
      );
  }

}
