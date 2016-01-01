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
import {selectGrid} from 'core/form/formUtils';

import {updateGridObjectAction, updateGridObjectGridAction} from 'core/grid/gridActions';
import GridService from 'core/grid/gridService';
import Grid from 'core/grid/domain/grid';
import GridComp from 'core/grid/component/gridComp';

const Colors = Styles.Colors;
const Typography = Styles.Typography;

const gridConfigGridLocation = 'gridConfigList';

function mapStateToProps(state) {
  let gridObject = state.getIn(['grid', 'gridObject']);

  return {
    gridObject,
    gridConfigGrid: selectGrid(state, gridObject, gridConfigGridLocation),
    entities: state.getIn(['metamodel', 'entities'])
  };
}


@connect(mapStateToProps, {updateGridObjectAction, updateGridObjectGridAction})
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
    console.log("GridLocationDetail#fetchData()");

    let gridObjectPromise = MdEntityService.fetchEntities(['GridLocation', 'GridConfig'])
      .then(() => {
        return GridService.readGridLocation(routerParams.id);
      })
      .then((gridObject) => {
        gridObject.$grids = {};
        return store.dispatch(updateGridObjectAction(gridObject));
      });

    //let gridPromise = GridService.fetchGrids(routerParams.id)
    //  .then(grid => {
    //    return store.dispatch(updateGridLocationAction(grid));
    //  });

    let gridPromise = GridService.fetchGrids(gridConfigGridLocation);

    return When.all([gridObjectPromise, gridPromise]);
  }


  /**
   *
   */
  componentWillMount() {
    console.debug('GridLocationDetail#componentWillMount, props: %o', this.props);

    customizeThemeForDetail(this.context.muiTheme);

    let {gridObject,gridConfigGrid,updateGridObjectGridAction} = this.props;


    gridConfigGrid.activeGridConfig = gridConfigGrid.getActiveGridConfig();
    gridConfigGrid.masterId = gridObject.gridLocation;
    updateGridObjectGridAction(gridConfigGrid);
  }


  componentDidMount() {
    //this.searchUserGrids();
    this.refs[this.props.gridConfigGrid.gridLocation].search();
  }

  componentWillUnmount() {
    this.props.updateGridObjectAction(null);
  }




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
      gridObject,
      gridConfigGrid,
      entities,
      updateGridObjectAction
      } = this.props;


    console.debug('%c GridLocationDetail render', 'background-color: yellow');


    return (
      <main className="main-content container" style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        {this._createToolMenu()}

        <BlockComp style={{marginTop: 10}} header="Grid">
          <form >
            {gridObject.label} ({gridObject.gridLocation}) for entity {gridObject.entityName}
            <br/>
            TODO: label edit
          </form>
        </BlockComp>

        <GridComp ref={gridConfigGrid.gridLocation} grid={gridConfigGrid} uiLocation="main" updateGrid={this.props.updateGridObjectGridAction} gridClassName="detail-grid"/>

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

