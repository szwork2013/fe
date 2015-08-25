import React from 'react';
import {State} from 'react-router';
import reactMixin from 'react-mixin';

import PageAncestor from 'core/common/page/pageAncestor';
import GridService from 'core/grid/service/gridService';

@reactMixin.decorate(State)
export default class ContactPersonList extends PageAncestor {

  static fetchData(params) {
    console.log("ContactPersonList#fetchData(%o)", params);
    return GridService.fetchGrids('contactPersonList');
  }


  render() {
    var name = this.getPath();

    return (
        <h1>Contact Person list
          {name}
        </h1>
      );
  }

}



