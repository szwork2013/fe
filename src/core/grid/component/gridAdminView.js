import React from 'react';
import {Alert} from 'react-bootstrap';
import { FlatButton, SelectField, TextField, RaisedButton, Checkbox } from 'material-ui';
import Select  from 'react-select';
import connectToStores from 'alt/utils/connectToStores';
import reactMixin from 'react-mixin';
import Router from 'react-router';
import _ from 'lodash';
import When from 'when';

import hoistNonReactStatics from 'core/common/utils/hoistNonReactStatics';
import PageAncestor from 'core/common/page/pageAncestor';
import Axios from 'core/common/config/axios-config';

import GridStore from 'core/grid/store/gridStore';
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
import CommonService from 'core/common/service/commonService';


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
    grid: React.PropTypes.instanceOf(Grid)
  };


  static getStores(props) {
    return [GridStore];
  }

  // multiple stores @see https://github.com/goatslacker/alt/issues/420
  static getPropsFromStores(props) {
    let grid = GridStore.getGrid(props.params.gridLocation);
    return {grid};
  }

  state = {
    gridId: null,
    editedGridConfig: null,
    errorMessages: []
  };





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
      this.setState({editedGridConfig: clonedGridConfig});
    });
  };


  onClickSave = (evt) => {
    console.log('onClickSave %o', this.state.editedGridConfig);
    let grid = this.props.grid;
    // ulozim, na navrat musim aktualizovat editedGridConfig a grid v gridstoru

    if (this.validate()) {
      CommonService.loading(true);
      Axios.post('/core/grid-config', this.state.editedGridConfig)
        .then(response => {
          let editedGridConfig = response.data;
          GridConfig.clasifyJson(editedGridConfig, grid);
          grid.replaceGridConfig(editedGridConfig);
          GridActions.updateGrid(grid);

          CommonService.loading(false);

          this.setState({
            gridId: editedGridConfig.gridId,
            editedGridConfig: editedGridConfig
          });
          CommonService.toastSuccess("Grid byl úspěšně uložen");
        });
    }

  };

  validate() {
    let errorMessages = this.state.errorMessages;
    let editedGridConfig = this.state.editedGridConfig;

    errorMessages = [];
    let e1 = this.validateGridConfigName();
    if (e1) errorMessages.push(e1);

    if (_.isEmpty(editedGridConfig.columns)) {
      errorMessages.push("Musí být vybrán alespoň 1 sloupec");
    }

    editedGridConfig.conditions.forEach((condition, index) => this.validationCondition(condition, errorMessages, index));
    editedGridConfig.sortColumns.forEach((sortColumn, index) => this.validationSortColumn(editedGridConfig.sortColumns, sortColumn, errorMessages, index));

    this.setState({editedGridConfig, errorMessages});

    return _.isEmpty(errorMessages);
  }

  validationCondition(condition, errorMessages, index) {
    if (!condition.column || !condition.operator) {
      errorMessages.push( (index+1) + ". výběrový filtr musí mít vyplněn sloupec a operátor");
      return;
    }
    let allOperators = MdEntityStore.getEntity('FILTEROPERATOR').lovItems;
    let operator = allOperators.find(li => li.value === condition.operator);
    let cardinality = operator.params[0];
    if (cardinality == 1 || cardinality == "N") {
      if (_.isEmpty(condition.values) || !condition.values[0]) {
        errorMessages.push( (index+1) + ". výběrový filtr musí mít vyplněnou hodnotu");
      }
    }  else if (cardinality == 2) {
      if (_.isEmpty(condition.values) || condition.values.length < 2 || !condition.values[0] || !condition.values[1]) {
        errorMessages.push( (index+1) + ". výběrový filtr musí mít vyplněné obě hodnoty");
      }
    }
  }

  validationSortColumn(sortColumns, sortColumn, errorMessages, index) {
    if (!sortColumn.field || !sortColumn.sortOrder) {
      errorMessages.push( (index+1) + ". řazení v sestavě musí mít vyplněno sloupec a volbu řazení");
      return;
    }

    if (sortColumn.fixed) {
      if (sortColumns.filter( (v,i) =>  ( !v.fixed && i < index ) ).length > 0) {
        errorMessages.push("Uzamknutá řazení musí být na začátku seznamu řazení (tj. nemůže být například první řazení odemčené a druhé zamčené.")
      }
    }

  }

  onClickAdd = (evt) => {
    console.log('onClickAdd');

    let grid = this.props.grid;

    let gridConfig = new GridConfig(grid);
    gridConfig.gridUse = 'PRIVATE';
    gridConfig.gridLocation = this.props.params.gridLocation;
    gridConfig.columns = [];
    gridConfig.conditions = (grid.implicitConditions) ? grid.implicitConditions.map(gcc => Object.assign(new GridConfigCondition(gridConfig), gcc)) : [];
    gridConfig.sortColumns = [];
    gridConfig.entity = grid.$entityRef.id;

    this.fetchLovItems(gridConfig.conditions);

    this.setState({gridId: 0, editedGridConfig: gridConfig});
  };

  onClickDelete = (evt) => {
    let gridId = this.state.gridId;
    let grid = this.props.grid;
    console.log('onClickDelete ' + gridId);

    CommonService.loading(true);

    Axios.delete('/core/grid-config/' + gridId)
    .then(response => {
      grid.deleteGridConfig(gridId);
      GridActions.updateGrid(grid);
      CommonService.loading(false);
      this.setState({
        gridId: null,
        editedGridConfig: null});
    });
  };

  onClickBack = () => {
    console.log('onClickBack');
    let ok = this.context.router.goBack();
    if (!ok) {
      this.context.router.transitionTo(GridService.defaultRoutes[this.props.params.gridLocation]);
    }
  };


  onChangeGridConfigName = (evt) => {
    let gridName = evt.target.value;
    let editedGridConfig = this.state.editedGridConfig;
    editedGridConfig.gridName = gridName;
    this.setState({editedGridConfig});
  };

  onBlurGridConfigName = (evt) => {
    this.validateGridConfigName();
    this.setState({editedGridConfig: this.state.editedGridConfig});
  };

  validateGridConfigName() {
    let editedGridConfig = this.state.editedGridConfig;
    editedGridConfig.$error_gridName = (editedGridConfig.gridName) ? undefined : "Název sestavy je povinný";
    return editedGridConfig.$error_gridName;
  }



  onCheckGridUse = (evt, checked) => {
    console.log('onCheckGridUse checked: ' + checked);
    let editedGridConfig = this.state.editedGridConfig;
    editedGridConfig.gridUse = (checked) ? 'PUBLIC' : 'PRIVATE';
    this.setState({editedGridConfig});
  };

  onAddColumn = (fieldNames) => {
    console.log('onAddColumn FieldNames: ' + fieldNames);
    let grid = this.props.grid;
    let editedGridConfig = this.state.editedGridConfig;

    fieldNames.forEach(v => {
      editedGridConfig.columns.push(Utils.formatId(editedGridConfig.entity, v));
    });
    editedGridConfig.syncColumnRefs(grid.$entityRef);

    this.setState({editedGridConfig});
  };

  onDeleteColumn = (fieldNames) => {
    console.log('onDeleteColumn FieldNames: ' + fieldNames);
    let grid = this.props.grid;
    let editedGridConfig = this.state.editedGridConfig;

    fieldNames.forEach(v => {
      let fieldKey = Utils.formatId(editedGridConfig.entity, v);
      _.remove(editedGridConfig.columns, c => c == fieldKey);
    });

    editedGridConfig.syncColumnRefs(grid.$entityRef);

    this.setState({editedGridConfig});
  };

  onUpColumn = (fieldNames) => {
    console.log('onUpColumn FieldNames: ' + fieldNames);
    let grid = this.props.grid;
    let editedGridConfig = this.state.editedGridConfig;

    for(let v of fieldNames) {
      let fieldKey = Utils.formatId(editedGridConfig.entity, v);
      let index = editedGridConfig.columns.indexOf(fieldKey);
      if (index < 1) {
        return;
      }
      ArrayUtils.move(editedGridConfig.columns, index, index - 1);
    }

    editedGridConfig.syncColumnRefs(grid.$entityRef);

    this.setState({editedGridConfig});
  };

  onDownColumn = (fieldNames) => {
    console.log('onDownColumn FieldNames: ' + fieldNames);
    let grid = this.props.grid;
    let editedGridConfig = this.state.editedGridConfig;

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

    this.setState({editedGridConfig});
  };

  onClickAddFilter = (evt) => {
    console.log('onClickAddFilter');
    let editedGridConfig = this.state.editedGridConfig;

    let condition = new GridConfigCondition(editedGridConfig);
    editedGridConfig.conditions.push(condition);
    this.setState({editedGridConfig});
  };

  onChangeConditionColumn(condition, newColKey) {
    console.log('onChangeConditionColumn: ', newColKey, condition);
    let editedGridConfig = this.state.editedGridConfig;
    condition.column = newColKey;
    condition.operator = null;
    condition.values = [];

    this.fetchLovItems([condition]);

    this.setState({editedGridConfig});
  };

  fetchLovItems(conditions) {
    if (_.isEmpty(conditions)) return;

    let valueSources = _.uniq(conditions.filter(c => (c.$columnRef && c.$columnRef.valueSource)).map(c => c.$columnRef.valueSource));

    if (valueSources.length > 0) {
      MdEntityService.fetchEntities(valueSources, {}, [true]);
    }
  }

  onChangeConditionOperator(condition, newOperator) {
    console.log('onChangeConditionOperator: ', newOperator, condition);
    let editedGridConfig = this.state.editedGridConfig;
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

    this.setState({editedGridConfig});
  };

  onChangeConditionValues = (condition) => {
    console.log('onChangeConditionValues: condition %o', condition);
    this.setState({editedGridConfig: this.state.editedGridConfig});
  };

  onDeleteCondition(index) {
    console.log('onDeleteCondition: ', index);
    let editedGridConfig = this.state.editedGridConfig;
    editedGridConfig.conditions.splice(index, 1);
    this.setState({editedGridConfig});
  }

  onChangeSortField(sort, newColKey) {
    console.log('onChangeSortField: ', newColKey, sort);
    sort.field = newColKey;
    this.setState({editedGridConfig: this.state.editedGridConfig});
  };

  onChangeSortOrder(sort, newOrder) {
    console.log('onChangeSortOrder: ', newOrder, sort);
    sort.sortOrder = newOrder;
    this.setState({editedGridConfig: this.state.editedGridConfig});
  }

  onCheckSortFixed = (evt, checked) => {
    console.log('onCheckSortFixed: checked = ' + checked);
    this.setState({editedGridConfig: this.state.editedGridConfig});
  };

  onClickAddSort = (evt) => {
    console.log('onClickAddSort');
    let editedGridConfig = this.state.editedGridConfig;

    let sort = new GridConfigSort(editedGridConfig);
    editedGridConfig.sortColumns.push(sort);
    this.setState({editedGridConfig});
  };

  onDeleteSort(index) {
    console.log('onDeleteSort: ', index);
    let editedGridConfig = this.state.editedGridConfig;
    editedGridConfig.sortColumns.splice(index, 1);
    this.setState({editedGridConfig});
  }

  /* ****************   REACT METHODS ************************************************************ */

  render() {
    let {
      grid,
      ...other,
      } = this.props;

    let editedGridConfig = this.state.editedGridConfig;
    let errorMessages = this.state.errorMessages;

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
      <main className="main-content container">
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
          <form onValidSubmit={this.submit}>
            <h4 style={{marginTop: 20}}>
              {(this.state.gridId !== 0) ? 'Edituj sestavu' : 'Nová sestava' }
            </h4>

            { (_.isEmpty(errorMessages)) ? '' : this._createErrorMessagesElement(errorMessages) }

            <BlockComp header="1. Změna názvu sestavy">
              <div style={{display: 'flex', whiteSpace: 'nowrap'}}>
                <div style={{display: 'flex', alignItems: 'baseline'}}>
                  <TextField name="gridName"
                             floatingLabelText="Název sestavy"
                             style={inputStyle} required errorText={editedGridConfig.$error_gridName}
                             value={editedGridConfig.gridName} onChange={this.onChangeGridConfigName} onBlur={this.onBlurGridConfigName}  />
                  <LocalizeField/>
                </div>
                <div style={{marginLeft: 30, alignSelf: 'flex-end', marginBottom: 5}}>
                  <Checkbox name="gridUse" defaultChecked={editedGridConfig.gridUse == 'PUBLIC'} value={editedGridConfig.gridUse == 'PUBLIC'} label="Public Grid" onCheck={this.onCheckGridUse}/>
                </div>
              </div>
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
                          <Select name="conditionColumn" value={condition.column} options={fieldOptions} onChange={this.onChangeConditionColumn.bind(this, condition)} clearable={false} disabled={condition.implicit}/>
                        </td>
                        <td>
                          <Select name="conditionOperator" value={condition.operator} options={operatorOptions} onChange={this.onChangeConditionOperator.bind(this, condition)}  clearable={false}  disabled={condition.implicit}/>
                        </td>
                        <td>
                          <ConditionValue condition={condition} onChange={this.onChangeConditionValues} disabled={condition.implicit}/>
                        </td>
                        <td>
                          {
                            (condition.implicit) ? '' : (
                              <a className="font-button-link" onClick={this.onDeleteCondition.bind(this, index)}>
                                <span className="fa fa-trash"/>
                              </a>
                            )
                          }
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
                          <Checkbox name="sortFixed" value={sort.fixed} defaultChecked={sort.fixed} label="Fixní řazení" onCheck={this.onCheckSortFixed}/>
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

          </form>
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

  _createErrorMessagesElement(errorMessages) {
    return (
      <Alert bsStyle='danger'>
        <ul>
          {
            errorMessages.map(str => {
              return (
                <li>{str}</li>
              );
            })
          }
          {this.state.errorMessage}
        </ul>
      </Alert>
    );
  }


}

// pokud ma "connectToStores" componenta fetchData nebo jinou statickou metodu musi se patchnout pomoci hoistNonReactStatics, protoze connectToStores by ji vyrusila...
export default hoistNonReactStatics(connectToStores(GridAdminView), GridAdminView);
