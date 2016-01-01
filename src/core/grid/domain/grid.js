import {remove, findIndex, first, isString, isEmpty} from 'lodash';

import GridConfig from 'core/grid/domain/gridConfig';
import GridConfigCondition from 'core/grid/domain/gridConfigCondition';

export default class Grid {

  static clone(grid) {
    return Object.assign(new Grid({}), grid);
  }

  constructor (gridLocationDto) {
    // string gridLocation
    this.gridLocation = gridLocationDto.gridLocation;
    this.entityName = gridLocationDto.entityName;
    this.implicitConditions = gridLocationDto.implicitConditions;
    this.masterFields = gridLocationDto.masterFields;
    this.label = gridLocationDto.label;

    // array of GridConfig
    this.gridConfigs = gridLocationDto.gridConfigs;

    // navratova hodnota Grid ze serveru
    this.data = null;

    // reference na MdEntity
    this.$entityRef = null;

    // pole sirek sloupcu, spocitane na zaklade aktivniho gridConfigu a dat
    this.gridWidths = null;

    // searchTerm
    this.searchTerm = null;

    // vybrany gridConfig
    this.activeGridConfig = null;

    // aktualni [{field: MdField, desc: false/true}, ....]
    this.sortArray = null;

    // aktualni [gridConfigCondition, ....]
    this.conditionArray = null;

    // id na master entitu u seznamu na detailech
    this.masterId;

    this.loading;

    this.showSelection = false;
    this.selectedRows = new Map();
    this.selectedAllRows = false;
    this.lastClickedRow;
    this.headerPaddingRight = 0;

  }


  getGridConfig(gridId) {
    return this.gridConfigs.find(gc => gc.gridId == gridId);
  }

  deleteGridConfig(gridId) {
    remove(this.gridConfigs, gc => gc.gridId == gridId);
  }

  replaceGridConfig(gridConfig) {
    let index = findIndex(this.gridConfigs, gc => gc.gridId === gridConfig.gridId);
    if (index >= 0) {
      this.gridConfigs.splice(index, 1, gridConfig);
    } else {
      this.gridConfigs.push(gridConfig);
    }
  }


  /**
   * Vrati aktivni gridConfig, pokud je zadany gridId, zkousi hledat ten
   * @param gridId -nepovinny paramter
     */
  getActiveGridConfig(gridId) {
    let agc;
    if (gridId) {
      agc = this.gridConfigs.find(gc => gc.gridId == gridId);
    }

    if (!agc) {
      agc = first(this.gridConfigs.filter(gc => gc.defaultGrid));
    }

    if (!agc) {
      agc = first(this.gridConfigs);
    }

    return agc;
  }

  get activeGridWidths() {
    return (this.gridWidths) ? this.gridWidths : this.activeGridConfig.gridWidths;
  }


  /**
   * vrati pole stringu [fieldName1_ASC, fieldName2_DESC, ..]
   */
  get sort() {
    return (this.sortArray) ? this.sortArray.map(o => o.field.fieldName + ((o.desc)? "_DESC" : "_ASC") ) : null;
  }

  /**
   * setne sortArray - [ {field: field1Ref, desc: true/false}, ... ]  ze stringu (nebo pole stringu) fieldName1_ASC
   */
  set sort(sortValue) {
    if (sortValue) {
      if (isString(sortValue)) {
        sortValue = [sortValue];
      }
      this.sortArray = sortValue.map(str => {
        let split = str.split('_');
        return {field: this.$entityRef.fields[split[0]], desc: (split[1] === 'DESC') };
      });
    } else {
      this.sortArray = [];
    }
  }

  /**
   * vytvori z conditionArray (pole gridConfigCondition) ->  { filter: [fieldName1_EQUAL, fieldName2_IN, ...],  fieldName1: [value11, value12, ...], fieldName2: [value21, value22, ...], .... }
   */
  getConditionQueryObject() {
    if (isEmpty(this.conditionArray)) {
      return {};
    } else {
      let queryObject = {filter: []};
      for(let gcc of this.conditionArray) {
        queryObject.filter.push(gcc.columnName + "_" + gcc.operator);
        queryObject[gcc.columnName] = gcc.values;
      }
      return queryObject;
    }
  }

  getTotalCount() {
    if (typeof this.data === 'undefined') {
      return 'undefined';
    } else if (!this.data) {
      return 'null';
    } else {
      return this.data.totalCount;
    }
  }

  /**
   * setne conditionArray (pole gridConfigCondition) z { filter: [fieldName1_EQUAL, fieldName2_IN, ...],  fieldName1: [value11, value12, ...], fieldName2: [value21, value22, ...], .... }
   */
  setConditionQueryObject(query) {

    if (isEmpty(query.filter)) {
      this.conditionArray = null;
    } else {
      this.conditionArray = [];
      for(let oper of query.filter) {
        let gcc = new GridConfigCondition(this.activeGridConfig);
        let operFrags = oper.split('_');
        let fieldName = operFrags[0];
        gcc.column = this.entityName + "_" + fieldName;
        gcc.operator = operFrags[1];
        gcc.values = query[fieldName];

        this.conditionArray.push(gcc);
      }
    }
  }


  reset() {
    this.data = null;
    this.gridWidths = null;
    this.searchTerm = null;
    this.activeGridConfig = null;
    this.sortArray = null;
    this.masterId = null;
    this.loading = false;
    this.showSelection = false;
    this.selectedRows = new Map();
    this.selectedAllRows = false;
    this.lastClickedRow = undefined;
    this.headerPaddingRight = 0;
  }




}
