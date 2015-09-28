import React from 'react';
//import {Input} from 'react-bootstrap';
import { FlatButton, SelectField, TextField, RaisedButton, Checkbox } from 'material-ui';
import Select  from 'react-select';
import connectToStores from 'alt/utils/connectToStores';
import reactMixin from 'react-mixin';
import Router from 'react-router';
import _ from 'lodash';
import When from 'when';

import hoistNonReactStatics from 'core/common/utils/hoistNonReactStatics';
import PageAncestor from 'core/common/page/pageAncestor';


import GridStore from 'core/grid/store/gridStore';
import GridAdminStore from 'core/grid/store/gridAdminStore';
import GridActions from 'core/grid/action/gridActions';
import Grid from 'core/grid/domain/grid';
import GridConfig from 'core/grid/domain/gridConfig';
import GridConfigCondition from 'core/grid/domain/gridConfigCondition';
import GridConfigSort from 'core/grid/domain/gridConfigSort';
import GridService from 'core/grid/service/gridService';
import Utils from 'core/common/utils/utils';
import ArrayUtils from 'core/common/utils/arrayUtils';
import MdEntityService from 'core/metamodel/mdEntityService';
import MdEntityStore from 'core/metamodel/mdEntityStore';
import ConditionValue from 'core/grid/component/conditionValue';


import Toolmenu from 'core/components/toolmenu/toolmenu';
import BlockComp from 'core/components/blockComp/blockComp';
import LocalizeField from 'core/components/localizeField/localizeField';
import DualSelector from 'core/components/dualSelector/dualSelector';

class GridAdminView extends PageAncestor {

  static title = 'Manage Grid';
  static icon = 'wrench';

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  };


  static fetchData(routerParams) {
    console.log("GridAdminView#fetchData(%o)", routerParams);
    return When.join(
      GridService.fetchGrids(routerParams.gridLocation),
      MdEntityService.fetchEntities(['FILTEROPERATOR'], {}, [true])
    );
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


  componentWillUnmount() {
    GridActions.updateEditedGridConfig(null);
  }


  /* ****************   EVENT HENDLERS ************************************************************ */

  onChangeGridConfig = (evt) => {
    let gridId = evt.target.value;
    console.log('onChangeGridConfig gridId = %s', gridId);
    this.setState({gridId});
    let gridConfig = this.props.grid.getGridConfig(gridId);
    let clonedGridConfig = gridConfig.clone();

    // dotahny vsechny existujici seznamy
    let valueSources = _.uniq(clonedGridConfig.conditions
      .filter(condition => (condition.$columnRef && condition.$columnRef.valueSource) )
      .map(condition => (condition.$columnRef.valueSource)));

    MdEntityService.fetchEntities(valueSources, {}, valueSources.map(v => true) )
    .then(() => {
      GridActions.updateEditedGridConfig(clonedGridConfig);
    });
  };


  onClickSave = (evt) => {
    console.log('onClickSave');
  };

  onClickAdd = (evt) => {
    console.log('onClickAdd');

    this.setState({gridId: 0});

    let grid = this.props.grid;

    let gridConfig = new GridConfig(grid);
    gridConfig.columns = [];
    gridConfig.conditions = [];
    gridConfig.sortColumns = [];
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

  onClickBack = () => {
    console.log('onClickBack');
    let ok = this.context.router.goBack();
    if (!ok) {
      this.context.router.transitionTo(GridService.defaultRoutes[this.props.params.gridLocation]);
    }
  }


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

    let condition = new GridConfigCondition(editedGridConfig);
    editedGridConfig.conditions.push(condition);
    GridActions.updateEditedGridConfig(editedGridConfig);
  };

  onChangeConditionColumn(condition, newColKey) {
    console.log('onChangeConditionColumn: ', newColKey, condition);
    let editedGridConfig = this.props.editedGridConfig;
    condition.column = newColKey;
    condition.operator = null;
    condition.values = [];

    let field = condition.$columnRef;
    if (field && field.valueSource) {
      MdEntityService.fetchEntities([field.valueSource], {}, [true]);
    }

    GridActions.updateEditedGridConfig(editedGridConfig);
  };

  onChangeConditionOperator(condition, newOperator) {
    console.log('onChangeConditionOperator: ', newOperator, condition);
    let editedGridConfig = this.props.editedGridConfig;
    condition.operator = newOperator;

    if (newOperator) {
      let allOperators = MdEntityStore.getEntity('FILTEROPERATOR').lovItems;
      let operatorLov = allOperators.find(v => v.value === newOperator);

      if (operatorLov.params[0] === 'N') {
        condition.values = [];
      } else {
        condition.values = new Array(parseInt(operatorLov.params[0]));
      }
    } else {
      condition.values = [];
    }

    GridActions.updateEditedGridConfig(editedGridConfig);
  };

  onChangeConditionValues = (condition) => {
    console.log('onChangeConditionValues: condition %o', condition);
    GridActions.updateEditedGridConfig(this.props.editedGridConfig);
  };

  onDeleteCondition(index) {
    console.log('onDeleteCondition: ', index);
    let editedGridConfig = this.props.editedGridConfig;
    editedGridConfig.conditions.splice(index, 1);
    GridActions.updateEditedGridConfig(editedGridConfig);
  }

  onChangeSortField(sort, newColKey) {
    console.log('onChangeSortField: ', newColKey, sort);
    sort.field = newColKey;
    GridActions.updateEditedGridConfig(this.props.editedGridConfig);
  };

  onChangeSortOrder(sort, newOrder) {
    console.log('onChangeSortOrder: ', newOrder, sort);
    sort.sortOrder = newOrder;
    GridActions.updateEditedGridConfig(this.props.editedGridConfig);
  }

  onCheckSortFixed = (evt, checked) => {
    console.log('onCheckSortFixed: checked = ' + checked);
    GridActions.updateEditedGridConfig(this.props.editedGridConfig);
  };

  onClickAddSort = (evt) => {
    console.log('onClickAddSort');
    let editedGridConfig = this.props.editedGridConfig;

    let sort = new GridConfigSort(editedGridConfig);
    editedGridConfig.sortColumns.push(sort);
    GridActions.updateEditedGridConfig(editedGridConfig);
  };

  onDeleteSort(index) {
    console.log('onDeleteSort: ', index);
    let editedGridConfig = this.props.editedGridConfig;
    editedGridConfig.sortColumns.splice(index, 1);
    GridActions.updateEditedGridConfig(editedGridConfig);
  }

  /* ****************   REACT METHODS ************************************************************ */

  render() {
    let {
      grid,
      editedGridConfig,
      ...other,
      } = this.props;

    let inputStyle = {fontSize: 14};

    console.debug('render - editedGridConfig %o', editedGridConfig);

    let toolMenu = this._createToolMenu();
    let addButtonStyle = {fontWeight: 'normal', marginTop: 10, marginBottom: 10, paddingLeft: 10, paddingRight: 10};

    let fieldOptions = _.values(grid.$entityRef.fields).filter(field => field.filterable).map(field => {
      return {value: field.fieldKey, label: field.label};
    });

    let sortOrderOptions = [{value: 'ASC', label: 'Vzestupně'}, {value: 'DESC', label: 'Sestupně'}];

    let allOperators = MdEntityStore.getEntity('FILTEROPERATOR').lovItems;

    return (
      <main className="main-content">
        {toolMenu}

        <h4 className="zauzoo" style={{marginTop: 20}} >Průvodce správou sestav</h4>

        { (this.state.gridId !== 0) ? (
          <SelectField
            value={this.state.gridId}
            style={Object.assign(inputStyle, {marginLeft: 10})}
            menuItemStyle={inputStyle}
            onChange={this.onChangeGridConfig}
            hintText="Vyber Sestavu"
            menuItems={grid.gridConfigs} displayMember="label" valueMember="gridId" autocomplete="off"/>

        ) : ''}

        <hr/>

        { (editedGridConfig) ? (
          <div>
            <h4 style={{marginTop: 20}}>
              {(this.state.gridId !== 0) ? 'Edituj sestavu' : 'Nová sestava' }
            </h4>

            <BlockComp header="1. Změna názvu sestavy">
              <TextField
                floatingLabelText="Název sestavy"
                style={inputStyle}
                value={editedGridConfig.label} onChange={this.onChangeGridConfigLabel}/>
              <LocalizeField/>
            </BlockComp>

            <BlockComp header="2. Zvol sloupce sestavy">
              <DualSelector allObjects={_.values(grid.$entityRef.fields).filter(field => field.visible)}
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
                    <td style={{width: '31%'}}>Název sloupce</td>
                    <td style={{width: '16%'}}>Operátor</td>
                    <td style={{width: '51%'}}>Hodnota</td>
                    <td style={{width: '3%'}}></td>
                  </tr>
                </thead>
                <tbody>
                {
                  editedGridConfig.conditions.map( (condition, index) => {

                    let operatorOptions = (condition.$columnRef) ? allOperators
                      .filter(li => _.includes(condition.$columnRef.availableOperators, li.value)) : [];

                    console.debug('operatorOptions %o', operatorOptions);


                    return (
                      <tr key={index}>
                        <td>
                          <Select name="conditionColumn" value={condition.column} options={fieldOptions} onChange={this.onChangeConditionColumn.bind(this, condition)} clearable={false}/>
                        </td>
                        <td>
                          <Select name="conditionOperator" value={condition.operator} options={operatorOptions} onChange={this.onChangeConditionOperator.bind(this, condition)}  clearable={false}/>
                        </td>
                        <td>
                          <ConditionValue condition={condition} onChange={this.onChangeConditionValues}/>
                        </td>
                        <td>
                          <a className="font-button-link" onClick={this.onDeleteCondition.bind(this, index)}><span className="fa fa-trash"/></a>
                        </td>

                      </tr>
                    );
                  })
                }
                </tbody>
              </table>
              <RaisedButton style={addButtonStyle} onClick={this.onClickAddFilter}>
                <span className="fa fa-plus"/> <span style={{lineHeight: '40px'}}> Přidat filtr </span>
              </RaisedButton>
            </BlockComp>

            <BlockComp header="4. Urči řazení v sestavě">
              <table className="table">
                <thead>
                <tr>
                  <td style={{width: '40%'}}>Název sloupce</td>
                  <td style={{width: '30%'}}>Volba řazení</td>
                  <td style={{width: '25%'}}>Uzamknout řazení</td>
                  <td style={{width: '5%'}}></td>
                </tr>
                </thead>
                <tbody>
                {
                  editedGridConfig.sortColumns.map( (sort, index) => {

                    return (
                      <tr key={index}>
                        <td>
                          <Select name="sortColumn" value={sort.field} options={fieldOptions} onChange={this.onChangeSortField.bind(this, sort)} clearable={false}/>
                        </td>
                        <td>
                          <Select name="sortOrder" value={sort.sortOrder} options={sortOrderOptions} onChange={this.onChangeSortOrder.bind(this, sort)}  clearable={false}/>
                        </td>
                        <td>
                          <Checkbox name="sortFixed" value={sort.fixed} label="Fixní řazení" onCheck={this.onCheckSortFixed}/>
                        </td>
                        <td>
                          <a className="font-button-link" onClick={this.onDeleteSort.bind(this, index)}><span className="fa fa-trash"/></a>
                        </td>

                      </tr>
                    );
                  })
                }
                </tbody>
              </table>
              <RaisedButton style={addButtonStyle} onClick={this.onClickAddSort}>
                <span className="fa fa-plus"/> <span style={{lineHeight: '40px'}}> Přidat řazení </span>
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
          { (this.state.gridId != null) ? (
            <FlatButton onClick={this.onClickSave}>
              <span className="fa fa-save"/><span> Uložit sestavu</span>
            </FlatButton>
          ) : <div/>}
          { (this.state.gridId !== 0) ? (
            <FlatButton onClick={this.onClickAdd}>
              <span className="fa fa-file"/><span> Vytvořit novou sestavu</span>
            </FlatButton>
          ) : <div/>}
          { (this.state.gridId > 0) ? (
            <FlatButton onClick={this.onClickDelete}>
              <span className="fa fa-trash"/><span> Smazat sestavu</span>
            </FlatButton>
          ) : <div/>}
          <FlatButton onClick={this.onClickBack}>
            <span className="fa fa-chevron-left"/><span> Zpět</span>
          </FlatButton>
        </Toolmenu>
    );
  }


}

// pokud ma "connectToStores" componenta fetchData nebo jinou statickou metodu musi se patchnout pomoci hoistNonReactStatics, protoze connectToStores by ji vyrusila...
export default hoistNonReactStatics(connectToStores(GridAdminView), GridAdminView);
