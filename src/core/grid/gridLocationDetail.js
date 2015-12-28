import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import History from 'react-router/lib/History';
import {uniq, values} from 'lodash';
import When from 'when';
import { connect } from 'react-redux';
import { FlatButton, Styles, Tabs, Tab} from 'material-ui';

import PageAncestor from 'core/common/page/pageAncestor';
import Toolmenu from 'core/components/toolmenu/toolmenu';
import {store} from 'core/common/redux/store';
import MdEntityService from 'core/metamodel/mdEntityService';
import {customizeThemeForDetail, TabTemplate}  from 'core/common/config/mui-theme';
import {screenLg} from 'core/common/config/variables';
import BlockComp from 'core/components/blockComp/blockComp';

import {updateGridLocationAction} from 'core/grid/gridActions';
import GridService from 'core/grid/gridService';
import Grid from 'core/grid/domain/grid';
import GridComp from 'core/grid/component/gridComp';

const Colors = Styles.Colors;
const Typography = Styles.Typography;


function mapStateToProps(state) {
  let userObject = state.getIn(['security', 'userObject']);

  return {
    userObject,
    entities: state.getIn(['metamodel', 'entities'])
  };
}


@connect(mapStateToProps, {updateGridLocationAction})
export default class GridLocationDetail extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  static title = 'Grid';
  static icon = 'table';

  static willTransitionTo = PageAncestor.willTransitionTo;
  static willTransitionFrom = PageAncestor.willTransitionFrom;


  static contextTypes = {
    router: React.PropTypes.func.isRequired,
    muiTheme: React.PropTypes.object
  };

  static fetchData(routerParams, query) {
    console.log("UserDetail#fetchData()");

    let metadataPromise = MdEntityService.fetchEntities(['GridLocation']);

    let gridPromise = GridService.fetchGrids(routerParams.id)
      .then(grid => {
        return store.dispatch(updateGridLocationAction(grid));
      });

    //let gridPromise = GridService.fetchGrids(vehicleGridLocation, invoiceGridLocation, partyRelGridLocation);

    return When.all([metadataPromise, gridPromise]);
  }


  /**
   *
   */
  componentWillMount() {
    console.debug('UserDetail#componentWillMount, props: %o', this.props);

    customizeThemeForDetail(this.context.muiTheme);

    //this.initPartyGrids();
  }


  componentDidMount() {
    //this.searchUserGrids();
  }

  componentWillUnmount() {
    //this.mediaQuery.removeListener(this.mediaQueryListener);
    this.props.updateGridLocationAction(null);
  }

  //initUserGrids() {
  //  let {vehicleGrid, invoiceGrid} = this.props;
  //
  //  let updated = this.initGrid(vehicleGrid);
  //  if(this.mediaQuery.matches) {
  //    updated = updated | this.initGrid(invoiceGrid);  // pozor bitwise, nechci shortcutting
  //  }
  //  return !!updated;
  //}

  //searchUserGrids() {
  //  let {vehicleGrid, invoiceGrid} = this.props;
  //  if (!vehicleGrid.data) this.refs[vehicleGridLocation].search();
  //  if(this.mediaQuery.matches && !invoiceGrid.data) {
  //    this.refs[invoiceGridLocation].search();
  //  }
  //}

  //initGrid(grid) {
  //  console.log('initGrid %s', grid.gridLocation);
  //  let {partyObject, updateGridAction} = this.props;
  //
  //  let doUpdate = false;
  //  if (!grid.activeGridConfig) {
  //    grid.activeGridConfig = grid.getActiveGridConfig();
  //    doUpdate = true;
  //  }
  //  if (grid.masterId !== partyObject.partyId) {
  //    grid.masterId = partyObject.partyId;
  //    doUpdate = true;
  //  }
  //  if (doUpdate) updateGridAction(grid);
  //  return doUpdate;
  //}

  //activateTab(grid) {
  //  this.initGrid(grid);
  //  if (!grid.data) {
  //    setTimeout( () => {
  //      this.refs[grid.gridLocation].search();
  //    }, 0);
  //  }
  //}


  onSave = (evt) => {
    console.log('onSave');
  };
  onDelete = (evt) => {
    console.log('onDelete');
  };
  onBack = (evt) => {
    console.log('onBack %O', this.context.router);
    this.context.router.goBack();
  };


  render() {


    let {
      userObject,
      entities,
      setUserAction
      } = this.props;


    console.debug('%c GridLocationDetail render $open = %s', 'background-color: yellow', userObject.$open);


    return (
      <main className="main-content container">
        {this._createToolMenu()}

        <BlockComp style={{marginTop: 10}} header="Grid">
          <form >
            HA
          </form>
        </BlockComp>

      </main>
    );


  }


  _createToolMenu() {
    return (
      <Toolmenu>
        <FlatButton onClick={this.onSave}>
          <span className="fa fa-save"/><span> Save Grid</span>
        </FlatButton>
        <FlatButton onClick={this.onBack} disabled={History.length <= 1}>
          <span className="fa fa-chevron-left"/><span> Back</span>
        </FlatButton>
      </Toolmenu>
    );
  }


}

