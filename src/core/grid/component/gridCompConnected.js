import React from 'react';
import _ from 'lodash';

import GridStore from 'core/grid/store/gridStore';
import GridActions from 'core/grid/action/gridActions';
import GridComp from 'core/grid/component/gridComp';


export default class GridCompConnected extends React.Component {

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  };

  static defaultProps = {

  };

  static propTypes = {
    gridLocation: React.PropTypes.string.isRequired,
    gridId: React.PropTypes.string,
    query: React.PropTypes.object
  };


  constructor(props) {
    super(props);
    console.debug('GridCompConnected#constructor, props: %o', props);
  }

  onGridChange = (grid) => {
    console.debug('onGridChange(%o)',grid);

    var routeName = _.last(this.context.router.getCurrentRoutes()).name,
      params = this.context.router.getCurrentParams();

    if (grid.activeGridConfig) params.gridId = grid.activeGridConfig.gridId;

    let query = {
      searchTerm: grid.searchTerm,
      sort: grid.sort
    };

    this.context.router.replaceWith(routeName, params, query);
  };

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }


  componentWillMount() {
    console.debug('componentWillMount, props: %o', this.props);

    let query = this.props.query;

    let grid = GridStore.getGrid(this.props.gridLocation);

    grid.searchTerm = query.searchTerm;
    grid.activeGridConfig = grid.getActiveGridConfig(this.props.gridId);
    grid.sort = query.sort;

    GridActions.updateGrid(grid);
  }

  render() {
    console.debug('GridCompConnected#render, props: %o', this.props);
    return (
      <GridComp gridLocation="partyList" onGridChange={this.onGridChange}/>
    );
  }



}

