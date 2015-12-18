import React from 'react';
import {State} from 'react-router';
import reactMixin from 'react-mixin';

import PageAncestor from 'core/common/page/pageAncestor';
import GridService from 'core/grid/gridService';
import GridCompConnected from 'core/grid/component/gridCompConnected';

var gridLocation = 'partyContacts';

@reactMixin.decorate(State)
export default class ContactPersonList extends PageAncestor {

  static title = 'Contact persons';
  static icon = 'female';

  static fetchData(params) {
    console.log("ContactPersonList#fetchData(%s)", gridLocation);
    return GridService.fetchGrids(gridLocation);
  }


  render() {
    return (
      <GridCompConnected gridLocation={gridLocation} gridId={this.props.params.gridId} query={this.props.query} />
    );
  }

}



