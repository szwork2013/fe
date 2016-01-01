import React from 'react';
import {State} from 'react-router';
import reactMixin from 'react-mixin';

import PageAncestor from 'core/common/page/pageAncestor';
import GridService from 'core/grid/gridService';
import GridCompConnected from 'core/grid/component/gridCompConnected';
import {ZzIconButtonRoute} from 'core/components/toolmenu/toolmenu';


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
      <GridCompConnected gridLocation={gridLocation} gridId={this.props.params.gridId} query={this.props.query}>
        <ZzIconButtonRoute tooltip="New Contact Person" fontIcon="fa fa-user-plus"  routeName="partyDetail" params={{id: 'new'}} query={{partyCategory: 'FO', roles:2}} />
      </GridCompConnected>
    );
  }

}



