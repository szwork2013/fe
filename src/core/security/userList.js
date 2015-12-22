import React from 'react';

import PageAncestor from 'core/common/page/pageAncestor';
import GridService from 'core/grid/gridService';
import GridCompConnected from 'core/grid/component/gridCompConnected';
import {ZzIconButtonRoute} from 'core/components/toolmenu/toolmenu';

var gridLocation = 'userList';

export default class UserList extends PageAncestor {

  static title = 'Users';
  static icon = 'user';

  static fetchData(routerParams) {
    console.log("UserList#fetchData(%s)", gridLocation);
    return GridService.fetchGrids(gridLocation);
  }


  render() {
    return (
        <GridCompConnected gridLocation={gridLocation} gridId={this.props.params.gridId} query={this.props.query}>
            <ZzIconButtonRoute tooltip="New User" fontIcon="fa fa-user-plus"  routeName="userDetail" params={{id: 'new'}} />
        </GridCompConnected>
    );
  }


}
