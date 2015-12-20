import React from 'react';

import PageAncestor from 'core/common/page/pageAncestor';
import GridService from 'core/grid/gridService';
import GridCompConnected from 'core/grid/component/gridCompConnected';
import {ZzIconButtonRoute} from 'core/components/toolmenu/toolmenu';

var gridLocation = 'userList';

export default class UserList extends PageAncestor {

  static title = 'Users';
  static icon = 'user';

  //static fetchData(routerParams) {
  //  console.log("PartyList#fetchData(%s)", gridLocation);
  //  return GridService.fetchGrids(gridLocation);
  //}
  //
  //
  //render() {
  //  return (
  //      <GridCompConnected gridLocation={gridLocation} gridId={this.props.params.gridId} query={this.props.query}>
  //          <ZzIconButtonRoute tooltip="New Customer" fontIcon="fa fa-user-plus"  routeName="partyDetail" params={{id: 'new'}} query={{partyCategory: 'PO'}} />
  //      </GridCompConnected>
  //  );
  //}

  render() {

    return (
      <main className="main-content" style={{display: 'flex', flexDirection: 'column', height: '100%'}} >
        <div style={{width: '100%', backgroundColor: 'yellow'}}>
          <div style={{fontSize: 30}}>
            Ahoj Ahoj Ahoj Ahoj Ahoj Ahoj Ahoj Ahoj Ahoj Ahoj Ahoj Ahoj Ahoj Ahoj AhojAhoj Ahoj Ahoj Ahoj AhojAhoj Ahoj Ahoj Ahoj AhojAhoj Ahoj Ahoj Ahoj AhojAhoj Ahoj Ahoj Ahoj AhojAhoj Ahoj Ahoj Ahoj Ahoj Ahoj Ahoj Ahoj Ahoj Ahoj Ahoj Ahoj Ahoj Ahoj Ahoj
          </div>
        </div>

        <div style={{width: '100%', backgroundColor: 'red', flexGrow: 1, display: 'flex', minHeight: 0}}>
          <div style={{width: '100%', backgroundColor: 'red', flexGrow: 1, overflowY: 'auto', display: 'flex', minHeight: 0}}>
            <div style={{height: 2000}}>dsf ddf sdf</div>
          </div>
        </div>
      </main>
    );

  }

}
