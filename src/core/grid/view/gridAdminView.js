import React from 'react';
//import {Input} from 'react-bootstrap';
import { FlatButton, SelectField, TextField, RaisedButton } from 'material-ui';
import connectToStores from 'alt/utils/connectToStores';
import reactMixin from 'react-mixin';
import Router from 'react-router';
import _ from 'lodash';

import hoistNonReactStatics from 'core/common/utils/hoistNonReactStatics';
import PageAncestor from 'core/common/page/pageAncestor';


import GridStore from 'core/grid/store/gridStore';
import GridAdminStore from 'core/grid/store/gridAdminStore';
import GridActions from 'core/grid/action/gridActions';
import Grid from 'core/grid/domain/grid';
import GridConfig from 'core/grid/domain/gridConfig';
import GridConfigCondition from 'core/grid/domain/gridConfigCondition';
import GridService from 'core/grid/service/gridService';
import Utils from 'core/common/utils/utils';
import ArrayUtils from 'core/common/utils/ArrayUtils';


import Toolmenu from 'core/components/toolmenu/toolmenu';
import BlockComp from 'core/components/blockComp/blockComp';
import LocalizeField from 'core/components/localizeField/localizeField';
import DualSelector from 'core/components/dualSelector/dualSelector';

class GridAdminView extends PageAncestor {


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

  //static defaultProps = {
  //  editedGridConfig: {}
  //}


  static getStores(props) {
    return [GridStore, GridAdminStore];
  }

  // multiple stores @see https://github.com/goatslacker/alt/issues/420
  static getPropsFromStores(props) {
    let grid = GridStore.getGrid(props.params.gridLocation);
    let adminState = GridAdminStore.getState();
    return {grid, ...adminState};
  }

  state = {
    gridId: null
  };



  /* ****************   EVENT HENDLERS ************************************************************ */

  onChangeGridConfig = (evt) => {
    let gridId = evt.target.value;
    console.log('onChangeGridConfig gridId = %s', gridId);
    this.setState({gridId});
    let gridConfig = this.props.grid.getGridConfig(gridId);
    let clonedGridConfig = _.cloneDeep(gridConfig);
    Object.setPrototypeOf(clonedGridConfig, GridConfig.prototype);
    GridActions.updateEditedGridConfig(clonedGridConfig);
  };

  onClickSave = (evt) => {
    console.log('onClickSave');
  };

  onClickAdd = (evt) => {
    console.log('onClickAdd');
    let grid = this.props.grid;

    let gridConfig = new GridConfig();
    gridConfig.columns = [];
    gridConfig.conditions = [];
    gridConfig.entity = grid.$entityRef.id;
    GridActions.updateEditedGridConfig(gridConfig);
  };

  onClickDelete = (evt) => {
    console.log('onClickDelete');
    let gridId = this.state.gridId;
    let grid = this.props.grid;
    if (gridId) {
      grid.deleteGridConfig(gridId);
      this.setState({gridId: null});
    }
    GridActions.updateEditedGridConfig(null);
  };


  onChangeGridConfigLabel = (evt) => {
    let gridConfigLabel = evt.target.value;
    let editedGridConfig = this.props.editedGridConfig;
    editedGridConfig.label = gridConfigLabel;
    GridActions.updateEditedGridConfig(editedGridConfig);
  };

  onAddColumn = (fieldNames) => {
    console.log('onAddColumn FieldNames: ' + fieldNames);
    let grid = this.props.grid;
    let editedGridConfig = this.props.editedGridConfig;

    fieldNames.forEach(v => {
      editedGridConfig.columns.push(Utils.formatId(editedGridConfig.entity, v));
    });
    editedGridConfig.syncColumnRefs(grid.$entityRef);

    GridActions.updateEditedGridConfig(editedGridConfig);
  };

  onDeleteColumn = (fieldNames) => {
    console.log('onDeleteColumn FieldNames: ' + fieldNames);
    let grid = this.props.grid;
    let editedGridConfig = this.props.editedGridConfig;

    fieldNames.forEach(v => {
      let fieldKey = Utils.formatId(editedGridConfig.entity, v);
      _.remove(editedGridConfig.columns, c => c == fieldKey);
    });

    editedGridConfig.syncColumnRefs(grid.$entityRef);

    GridActions.updateEditedGridConfig(editedGridConfig);
  };

  onUpColumn = (fieldNames) => {
    console.log('onUpColumn FieldNames: ' + fieldNames);
    let grid = this.props.grid;
    let editedGridConfig = this.props.editedGridConfig;

    for(let v of fieldNames) {
      let fieldKey = Utils.formatId(editedGridConfig.entity, v);
      let index = editedGridConfig.columns.indexOf(fieldKey);
      if (index < 1) {
        return;
      }
      ArrayUtils.move(editedGridConfig.columns, index, index - 1);
    }

    editedGridConfig.syncColumnRefs(grid.$entityRef);

    GridActions.updateEditedGridConfig(editedGridConfig);
  };

  onDownColumn = (fieldNames) => {
    console.log('onDownColumn FieldNames: ' + fieldNames);
    let grid = this.props.grid;
    let editedGridConfig = this.props.editedGridConfig;

    let iLen = fieldNames.length;
    for (let i=iLen-1; i>=0; i--) {
      let v = fieldNames[i];
      let fieldKey = Utils.formatId(editedGridConfig.entity, v);
      let index = editedGridConfig.columns.indexOf(fieldKey);
      if (index >= editedGridConfig.columns.length - 1) {
        return;
      }
      ArrayUtils.move(editedGridConfig.columns, index, index + 1);
    }

    editedGridConfig.syncColumnRefs(grid.$entityRef);

    GridActions.updateEditedGridConfig(editedGridConfig);
  };

  onClickAddFilter = (evt) => {
    console.log('onClickAddFilter');
    let editedGridConfig = this.props.editedGridConfig;

    let condition = new GridConfigCondition();
    editedGridConfig.conditions.push(condition);
  };


  /* ****************   REACT METHODS ************************************************************ */

  render() {

    let {
      grid,
      editedGridConfig,
      ...other,
      } = this.props;

    let inputStyle = {fontSize: 14};

    console.debug('editedGridConfig %o', editedGridConfig);

    let toolMenu = this._createToolMenu();
    let addButtonStyle = {fontWeight: 'normal', marginTop: 10, marginBottom: 10};

    return (
      <main className="main-content">
        {toolMenu}

        <h4 className="zauzoo" style={{marginTop: 20}} >Průvodce správou sestav</h4>

        <SelectField
          value={this.state.gridId}
          style={Object.assign(inputStyle, {marginLeft: 10})}
          menuItemStyle={inputStyle}
          onChange={this.onChangeGridConfig}
          hintText="Vyber Sestavu"
          menuItems={grid.gridConfigs} displayMember="label" valueMember="gridId" autocomplete="off"/>

        <hr/>

        { (editedGridConfig) ? (
          <div>
            <h4 style={{marginTop: 20}}>Edituj sestavu</h4>

            <BlockComp header="1. Změna názvu sestavy">
              <TextField
                floatingLabelText="Název sestavy"
                style={inputStyle}
                value={editedGridConfig.label} onChange={this.onChangeGridConfigLabel}/>
              <LocalizeField/>
            </BlockComp>

            <BlockComp header="2. Zvol sloupce sestavy">
              <DualSelector allObjects={_.values(grid.$entityRef.fields)}
                            selectedObjects={editedGridConfig.$columnRefs}
                            optionValuePropertyName="fieldName"
                            optionTextPropertyName="label"
                            allObjectsLabel="Dostupné sloupce pro sestavu"
                            selectedObjectsLabel="Vložené sloupce v sestavě"
                            onAdd={this.onAddColumn}
                            onDelete={this.onDeleteColumn}
                            onUp={this.onUpColumn}
                            onDown={this.onDownColumn}/>
            </BlockComp>

            <BlockComp header="3. Aplikuj výběrové filtry">
              <table className="table">
                <thead>
                  <tr>
                    <td>Název sloupce</td>
                    <td>Operátor</td>
                    <td>Hodnota</td>
                  </tr>
                </thead>
                <tBody>
                </tBody>
              </table>
              <RaisedButton style={addButtonStyle} onClick={this.onClickAddFilter}>
                <span className="fa fa-plus"/> <span style={{lineHeight: '40px'}}> Přidat filtr </span>
              </RaisedButton>
            </BlockComp>

          </div>
        ) : ''}



      </main>

    );
  }


  /* ****************   NORMAL METHODS ************************************************************ */


  _createToolMenu() {
    return (
        <Toolmenu>
          <FlatButton onClick={this.onClickSave}>
            <span className="fa fa-save"/><span> Uložit sestavu</span>
          </FlatButton>
          <FlatButton onClick={this.onClickAdd}>
            <span className="fa fa-file"/><span> Vytvořit novou sestavu</span>
          </FlatButton>
          <FlatButton onClick={this.onClickDelete}>
            <span className="fa fa-trash"/><span> Smazat sestavu</span>
          </FlatButton>
        </Toolmenu>
    );
  }


}

export default hoistNonReactStatics(connectToStores(GridAdminView), GridAdminView);