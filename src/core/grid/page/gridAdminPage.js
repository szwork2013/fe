import React from 'react';
import {Navbar, Nav, NavDropdown, MenuItem, CollapsibleNav, ButtonToolbar, Button} from 'react-bootstrap';
import {Toolbar, ToolbarGroup, DropDownMenu, ToolbarTitle, FontIcon,DropDownIcon, ToolbarSeparator, RaisedButton, FlatButton } from 'material-ui';
import connectToStores from 'alt/utils/connectToStores';
import reactMixin from 'react-mixin';
import Router from 'react-router';

import hoistNonReactStatics from 'core/common/utils/hoistNonReactStatics';
import PageAncestor from 'core/common/page/pageAncestor';


import GridStore from 'core/grid/store/gridStore';
import GridAdminStore from 'core/grid/store/gridAdminStore';
import GridActions from 'core/grid/action/gridActions';
import Grid from 'core/grid/domain/grid';
import GridConfig from 'core/grid/domain/gridConfig';
import GridService from 'core/grid/service/gridService';

import Toolmenu from 'core/components/toolmenu/toolmenu';


class GridAdminPage extends PageAncestor {


  static fetchData(routerParams) {
    console.log("GridAdminPage#fetchData(%o)", routerParams);
    return GridService.fetchGrids(routerParams.gridLocation);
  }

  static propTypes = {
    params: React.PropTypes.object.isRequired,

    // from store
    grid: React.PropTypes.instanceOf(Grid),
    editedGridConfig: React.PropTypes.instanceOf(GridConfig)
  };


  static getStores(props) {
    return [GridStore, GridAdminStore];
  }

  // multiple stores @see https://github.com/goatslacker/alt/issues/420
  static getPropsFromStores(props) {
    let grid = GridStore.getGrid(props.params.gridLocation);
    let adminState = GridAdminStore.getState();
    return {grid, ...adminState};
  }

  //constructor(props) {
  //  super(props);
  //  console.debug('GridAdminPage#constructor, props: %o', props);
  //}


  onSelectGridConfig = (event, gridId) => {
    console.log('onSelectGridConfig gridId = ' + gridId);
  };


  render() {

    let toolMenu = this._createToolMenu();

    return (
      <main className="main-content">

        {toolMenu}

      </main>

    );
  }

  _createToolMenu() {

    let {
      grid,
      editedGridConfig,
      ...other,
      } = this.props;


    return (

      <div>

        <Toolmenu>

          <FlatButton>
            <span className="fa fa-save"/><span> Uložit sestavu</span>
          </FlatButton>
          <FlatButton>
            <span className="fa fa-file"/><span> Vytvořit novou sestavu</span>
          </FlatButton>
          <FlatButton>
            <span className="fa fa-trash"/><span> Smazat sestavu</span>
          </FlatButton>

        </Toolmenu>

      </div>

    );
  }


}

export default hoistNonReactStatics(connectToStores(GridAdminPage), GridAdminPage);

//<NavDropdown id="grid_admin_menu_toolbar" eventKey={3}
//             title={ (editedGridConfig) ? editedGridConfig.label : 'Vyberte Grid k editaci'}>
//  {
//    grid.gridConfigs.map((gc) => {
//      return (
//        <MenuItem eventKey={gc.gridId} key={gc.gridId}
//                  onSelect={this.onSelectGridConfig}>{gc.label}</MenuItem>
//      );
//    })
//  }
//</NavDropdown>
