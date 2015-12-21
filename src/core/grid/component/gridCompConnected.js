import React from 'react';
import _ from 'lodash';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';

import {updateGridAction} from 'core/grid/gridActions';
import GridComp from 'core/grid/component/gridComp';


function mapStateToProps(state, ownProps) {
  return {
    grid: state.getIn(['grid', 'grids', ownProps.gridLocation])
  };
}


@connect(mapStateToProps, {updateGridAction})
export default class GridCompConnected extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);


  static contextTypes = {
    router: React.PropTypes.func.isRequired
  };


  static propTypes = {
    gridLocation: React.PropTypes.string.isRequired,
    gridId: React.PropTypes.string,
    query: React.PropTypes.object,
    grid: React.PropTypes.object
  };


  constructor(props) {
    super(props);
    console.debug('GridCompConnected#constructor, props: %o', props);
  }

  onGridChange = (grid) => {
    console.debug('onGridChange(%o)', grid);

    var routeName = _.last(this.context.router.getCurrentRoutes()).name,
      params = this.context.router.getCurrentParams();

    if (grid.activeGridConfig) params.gridId = grid.activeGridConfig.gridId;

    let query = Object.assign({
      searchTerm: grid.searchTerm,
      sort: grid.sort
    }, grid.getConditionQueryObject());

    console.debug('replaceWith %s, %o, %o', routeName, params, query);

    this.context.router.replaceWith(routeName, params, query);
  };

  updateGrid = (grid) => {
    this.props.updateGridAction(grid);
  };


  componentWillMount() {
    console.debug('componentWillMount, props: %o', this.props);

    let {query, grid} = this.props;

    grid.searchTerm = query.searchTerm;
    grid.activeGridConfig = grid.getActiveGridConfig(this.props.gridId);
    grid.sort = query.sort;

    console.log(grid.activeGridConfig);

    grid.setConditionQueryObject(query);

    updateGridAction(grid);
  }

  componentDidMount() {
    this.refs.gridComp.search();
  }

  componentWillUnmount() {
    const {grid, updateGridAction} = this.props;
    grid.reset();
    updateGridAction(grid);
  }





  render() {
    console.debug('GridCompConnected#render, props: %o', this.props);
    return (
      <GridComp ref="gridComp" grid={this.props.grid} uiLocation="page" onGridChange={this.onGridChange} updateGrid={this.updateGrid}>
        {this.props.children}
      </GridComp>
    );
  }


}

