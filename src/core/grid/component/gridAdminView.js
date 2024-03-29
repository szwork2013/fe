import React from 'react';
import {Alert} from 'react-bootstrap';
import { FlatButton, SelectField, TextField, RaisedButton, Checkbox, MenuItem } from 'material-ui';
import reactMixin from 'react-mixin';
import Router from 'react-router';
import _ from 'lodash';
import When from 'when';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import PageAncestor from 'core/common/page/pageAncestor';
import Axios from 'core/common/config/axios-config';
import { connect } from 'react-redux';

import Grid from 'core/grid/domain/grid';
import GridConfig from 'core/grid/domain/gridConfig';
import GridConfigCondition from 'core/grid/domain/gridConfigCondition';
import GridConfigSort from 'core/grid/domain/gridConfigSort';
import GridService from 'core/grid/gridService';
import Utils from 'core/common/utils/utils';
import ArrayUtils from 'core/common/utils/arrayUtils';
import MdEntityService from 'core/metamodel/mdEntityService';
import ConditionValue from 'core/grid/component/conditionValue';
import CommonService from 'core/common/service/commonService';
import {updateGridAction} from 'core/grid/gridActions';

import Toolmenu from 'core/components/toolmenu/toolmenu';
import BlockComp from 'core/components/blockComp/blockComp';
import LocalizeField from 'core/components/localizeField/localizeField';
import DualSelector from 'core/components/dualSelector/dualSelector';
import StyledSelect from 'core/components/styledSelect/styledSelect';
import {styleSmall, styleTextFieldSmall} from 'core/form/createForm';


function mapStateToProps(state, ownProps) {
  return {
    allOperators: state.getIn(['metamodel', 'entities', 'FILTEROPERATOR']).lovItems,
    grid: state.getIn(['grid', 'grids', ownProps.params.gridLocation])
  };
}


@connect(mapStateToProps, {updateGridAction})
export default class GridAdminView extends React.Component {
  // shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this); // zatim byt nemuze dokud jsou ve state objekty

  static title = 'Manage Grid';
  static icon = 'wrench';
  static willTransitionFrom = PageAncestor.willTransitionFrom;
  static willTransitionTo = PageAncestor.willTransitionTo;

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  };


  static fetchData(routerParams) {
    console.log("GridAdminView#fetchData(%o)", routerParams);
    return When.join(
      GridService.fetchGrids(routerParams.gridLocation),
      MdEntityService.fetchEntities([{entity: 'FILTEROPERATOR', lov: true}])
    );
  }

  static propTypes = {
    params: React.PropTypes.object.isRequired,

    // from store
    grid: React.PropTypes.instanceOf(Grid)
  };


  state = {
    gridId: null,
    editedGridConfig: null,
    errorMessages: []
  };


  /* ****************   EVENT HENDLERS ************************************************************ */

  onChangeGridConfig = (evt, key, gridId) => {
    console.log('onChangeGridConfig gridId = %s', gridId);
    //this.setState({gridId});
    let gridConfig = this.props.grid.getGridConfig(gridId);
    let clonedGridConfig = gridConfig.clone();

    // dotahny vsechny existujici seznamy
    let valueSources = _.uniq(clonedGridConfig.conditions
      .filter(condition => (condition.$columnRef && condition.$columnRef.hasLocalValueSource()))
      .map(condition => ({entity: condition.$columnRef.valueSource, lov: true})));

    MdEntityService.fetchEntities(valueSources)
      .then(() => {
        this.setState({gridId, editedGridConfig: clonedGridConfig});
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
          updateGridAction(grid);

          CommonService.loading(false);

          this.setState({
            gridId: editedGridConfig.gridId,
            editedGridConfig: editedGridConfig
          });
          CommonService.toastSuccess("Grid byl úspěšně uložen");
        });
    }

  };

  pushIfTrue(array, value) {
    if (value) array.push(value);
  }

  validate() {
    let errorMessages = this.state.errorMessages;
    let editedGridConfig = this.state.editedGridConfig;

    errorMessages = [];
    this.pushIfTrue(errorMessages, this.validateGridConfigName());
    this.pushIfTrue(errorMessages, this.validateGridScrollSize());
    this.pushIfTrue(errorMessages, this.validateGridScrollIncrement());
    this.pushIfTrue(errorMessages, this.validateMaxColumnWidth());


    if (_.isEmpty(editedGridConfig.columns)) {
      errorMessages.push("Musí být vybrán alespoň 1 sloupec");
    }

    editedGridConfig.conditions.forEach((condition, index) => GridService.validateCondition(condition, errorMessages, index, this.props.allOperators));
    editedGridConfig.sortColumns.forEach((sortColumn, index) => GridService.validateSortColumn(editedGridConfig.sortColumns, sortColumn, errorMessages, index));

    this.setState({editedGridConfig, errorMessages});

    return _.isEmpty(errorMessages);
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
    gridConfig.gridScrollSize = 100000;
    gridConfig.gridScrollIncrement = 1000;
    gridConfig.maxColumnWidth = 350;

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
        updateGridAction(grid);
        CommonService.loading(false);
        this.setState({
          gridId: null,
          editedGridConfig: null
        });
      });
  };

  onClickBack = () => {
    console.log('onClickBack');
    let ok = this.context.router.goBack();
    if (!ok) {
      this.context.router.transitionTo(this.props.params.gridLocation);
    }
  };

//  text fields change handlers
  onChangeTextField(fieldName, isNumber, evt) {
    console.debug('onChangeTextField %s, value = %s', fieldName, evt.target.value);
    let editedGridConfig = this.state.editedGridConfig;
    editedGridConfig[fieldName] = evt.target.value;
    this.setState({editedGridConfig});
  };

  validateTextField(fieldName, message, isPositiveNumber) {
    let editedGridConfig = this.state.editedGridConfig;
    let value = editedGridConfig[fieldName];

    console.debug('validateTextField %s, value = %s', fieldName, value);

    let error;
    if (isPositiveNumber) {
      value = parseInt(value);
      if (!Number.isInteger(value)) {
        error = message;
      }
    } else if (!value) {
      error = message;
    }
    editedGridConfig['$error_' + fieldName] = error;
    return error;
  }


  validateGridConfigName = () => this.validateTextField('gridName', "Název sestavy je povinný");
  onBlurGridConfigName = () => {
    this.validateGridConfigName();
    this.setState({editedGridConfig: this.state.editedGridConfig});
  };
  validateGridScrollSize = () => this.validateTextField('gridScrollSize', "Grid scroll size je povinné kladné číslo", true);
  onBlurGridScrollSize = () => {
    this.validateGridScrollSize();
    this.setState({editedGridConfig: this.state.editedGridConfig});
  };
  validateGridScrollIncrement = () => this.validateTextField('gridScrollIncrement', "Grid scroll increment je povinné kladné číslo", true);
  onBlurGridScrollIncrement = () => {
    this.validateGridScrollIncrement();
    this.setState({editedGridConfig: this.state.editedGridConfig});
  };
  validateMaxColumnWidth = () => this.validateTextField('maxColumnWidth', "Max column widh je povinné celé číslo", true);
  onBlurMaxColumnWidth = () => {
    this.validateMaxColumnWidth();
    this.setState({editedGridConfig: this.state.editedGridConfig});
  };


  onCheckGridUse = (evt, checked) => {
    console.log('onCheckGridUse checked: ' + checked);
    let editedGridConfig = this.state.editedGridConfig;
    editedGridConfig.gridUse = (checked) ? 'PUBLIC' : 'PRIVATE';
    this.setState({editedGridConfig});
  };

  onAddColumn = (fieldNames) => {
    console.log('onAddColumn FieldNames: %O', fieldNames);
    let grid = this.props.grid;
    let editedGridConfig = this.state.editedGridConfig;

    fieldNames.forEach(v => {
      editedGridConfig.columns.push(Utils.formatId(grid.entityName, v));
    });
    editedGridConfig.syncColumnRefs(grid.$entityRef);

    this.setState({editedGridConfig});
  };

  onDeleteColumn = (fieldNames) => {
    console.log('onDeleteColumn FieldNames: ' + fieldNames);
    let grid = this.props.grid;
    let editedGridConfig = this.state.editedGridConfig;

    fieldNames.forEach(v => {
      let fieldKey = Utils.formatId(grid.entityName, v);
      _.remove(editedGridConfig.columns, c => c == fieldKey);
    });

    editedGridConfig.syncColumnRefs(grid.$entityRef);

    this.setState({editedGridConfig});
  };

  onUpColumn = (fieldNames) => {
    console.log('onUpColumn FieldNames: ' + fieldNames);
    let grid = this.props.grid;
    let editedGridConfig = this.state.editedGridConfig;

    for (let v of fieldNames) {
      let fieldKey = Utils.formatId(grid.entityName, v);
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
    for (let i = iLen - 1; i >= 0; i--) {
      let v = fieldNames[i];
      let fieldKey = Utils.formatId(grid.entityName, v);
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

    let valueSources = _.uniq(conditions.filter(c => (c.$columnRef && c.$columnRef.hasLocalValueSource())).map(c => ({
      entity: c.$columnRef.valueSource,
      lov: true
    })));

    if (valueSources.length > 0) {
      MdEntityService.fetchEntities(valueSources);
    }
  }

  onChangeConditionOperator(condition, newOperator) {
    console.log('onChangeConditionOperator: ', newOperator, condition);
    let editedGridConfig = this.state.editedGridConfig;
    condition.operator = newOperator;

    if (newOperator) {
      let operatorLov = this.props.allOperators.find(v => v.value === newOperator);

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

  onCheckSortFixed(sort, evt, checked) {
    console.log('onCheckSortFixed: checked = ' + checked);
    sort.fixed = checked;
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
      allOperators,
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

    let publicGridConfig = new Boolean(editedGridConfig && editedGridConfig.gridUse == 'PUBLIC').toString();

    const gridConfigItems = grid.gridConfigs.map((li, i) => <MenuItem value={li.gridId} key={i}
                                                                      primaryText={li.label}/>);

    return (
      <main className="main-content container">
        {toolMenu}

        <h4 className="zauzoo" style={{marginTop: 20}}>Průvodce správou sestav</h4>

        { (this.state.gridId !== 0) ? (
          <SelectField
            value={this.state.gridId}
            style={Object.assign(inputStyle, {marginLeft: 10})}
            menuItemStyle={inputStyle}
            onChange={this.onChangeGridConfig}
            hintText="Vyber Sestavu" autoComplete="off">
            {gridConfigItems}
          </SelectField>

        ) : ''}

        <hr/>

        { (editedGridConfig) ? (
          <form onValidSubmit={this.submit}>
            <h4 style={{marginTop: 20}}>
              {(this.state.gridId !== 0) ? 'Edituj sestavu' : 'Nová sestava' }
            </h4>

            { (_.isEmpty(errorMessages)) ? '' : this._createErrorMessagesElement(errorMessages) }

            <BlockComp header="1. Změna názvu sestavy" style={{marginBottom: 30}}>
              <div style={{display: 'flex', whiteSpace: 'nowrap'}}>
                <div style={{display: 'flex', alignItems: 'baseline'}}>
                  <TextField name="gridName"
                             floatingLabelText="Název sestavy"
                             style={inputStyle} required
                             errorText={editedGridConfig.$error_gridName}
                             value={editedGridConfig.gridName}
                             onChange={this.onChangeTextField.bind(this, 'gridName', false)}
                             onBlur={this.onBlurGridConfigName}/>
                  <LocalizeField/>
                </div>
                <div style={{marginLeft: 30, alignSelf: 'flex-end', marginBottom: 5}}>
                  <Checkbox name="gridUse" defaultChecked={editedGridConfig.gridUse == 'PUBLIC'}
                            value={publicGridConfig} label="Public Grid" onCheck={this.onCheckGridUse}/>
                </div>
              </div>
            </BlockComp>

            <BlockComp header="2. Zvol sloupce sestavy" style={{marginBottom: 30}}>
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

            <BlockComp header="3. Aplikuj výběrové filtry" style={{marginBottom: 30}}>
              <table className="table">
                <thead>
                <tr>
                  <td style={{width: '30%'}}>Název sloupce</td>
                  <td style={{width: '20%'}}>Operátor</td>
                  <td style={{width: '47%'}}>Hodnota</td>
                  <td style={{width: '3%'}}></td>
                </tr>
                </thead>
                <tbody>
                {
                  editedGridConfig.conditions.map((condition, index) => {
                    console.debug('all operators: ', allOperators);
                    let operatorOptions = (condition.$columnRef) ? allOperators
                      .filter(li => _.includes(condition.$columnRef.availableOperators, li.value)) : [];

                    console.debug('operatorOptions %o', operatorOptions);

                    let borderStyle = (index > 0) ? {borderTop: 'inherit'} : {};

                    return (
                      <tr key={index}>
                        <td style={borderStyle}>
                          <StyledSelect {...styleSmall} name="conditionColumn" value={condition.column} options={fieldOptions} fullWidth={true}
                                        onChange={this.onChangeConditionColumn.bind(this, condition)} clearable={false}
                                        disabled={condition.implicit}/>
                        </td>
                        <td style={borderStyle}>
                          <StyledSelect {...styleSmall} name="conditionOperator" value={condition.operator} options={operatorOptions}  fullWidth={true}
                                        onChange={this.onChangeConditionOperator.bind(this, condition)}
                                        clearable={false} disabled={condition.implicit}/>
                        </td>
                        <td style={borderStyle}>
                          <ConditionValue condition={condition} onChange={this.onChangeConditionValues}
                                          disabled={condition.implicit}/>
                        </td>
                        <td style={borderStyle}>
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

            <BlockComp header="4. Urči řazení v sestavě" style={{marginBottom: 30}}>
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
                  editedGridConfig.sortColumns.map((sort, index) => {

                    let borderStyle = (index > 0) ? {borderTop: 'inherit'} : {};

                    return (
                      <tr key={index}>
                        <td style={borderStyle}>
                          <StyledSelect {...styleSmall} name="sortColumn" value={sort.field} options={fieldOptions}
                                        onChange={this.onChangeSortField.bind(this, sort)} clearable={false}/>
                        </td>
                        <td style={borderStyle}>
                          <StyledSelect {...styleSmall} name="sortOrder" value={sort.sortOrder} options={sortOrderOptions}
                                        onChange={this.onChangeSortOrder.bind(this, sort)} clearable={false}/>
                        </td>
                        <td style={borderStyle}>
                          <Checkbox style={Object.assign({marginTop: 10}, styleSmall)}  name="sortFixed" value={new Boolean(sort.fixed).toString()}
                                    defaultChecked={sort.fixed} label="Fixní řazení"
                                    onCheck={this.onCheckSortFixed.bind(this, sort)}/>
                        </td>
                        <td style={borderStyle}>
                          <a className="font-button-link" onClick={this.onDeleteSort.bind(this, index)}><span
                            className="fa fa-trash"/></a>
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

            <BlockComp header="5. Pokročilé nastavení" style={{marginBottom: 30}}>
              <div style={{display: 'flex'}}>
                <TextField name="gridScrollSize"
                           floatingLabelText="Max scroll Size"
                           style={inputStyle} required errorText={editedGridConfig.$error_gridScrollSize}
                           value={editedGridConfig.gridScrollSize}
                           onChange={this.onChangeTextField.bind(this, 'gridScrollSize', true)}
                           onBlur={this.onBlurGridScrollSize}/>
                <TextField name="gridScrollIncrement"
                           floatingLabelText="Scroll increment"
                           style={inputStyle} required errorText={editedGridConfig.$error_gridScrollIncrement}
                           value={editedGridConfig.gridScrollIncrement}
                           onChange={this.onChangeTextField.bind(this, 'gridScrollIncrement', true)}
                           onBlur={this.onBlurGridScrollIncrement}/>
                <TextField name="maxColumnWidth"
                           floatingLabelText="Max column width"
                           style={inputStyle} required errorText={editedGridConfig.$error_maxColumnWidth}
                           value={editedGridConfig.maxColumnWidth}
                           onChange={this.onChangeTextField.bind(this, 'maxColumnWidth', true)}
                           onBlur={this.onBlurMaxColumnWidth}/>
              </div>
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

