import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import {RaisedButton} from 'material-ui';
import {Tooltip, OverlayTrigger, Overlay, Popover} from 'react-bootstrap';

import MdField from 'core/metamodel/mdField';
import GridConfigCondition from 'core/grid/domain/gridConfigCondition';
import GridConfig from 'core/grid/domain/gridConfig';
import StyledSelect from 'core/components/styledSelect/styledSelect';
import MdEntityService from 'core/metamodel/mdEntityService';
import ConditionValue from 'core/grid/component/conditionValue';
import GridService from 'core/grid/service/gridService';

/**
 *
 */
export default class GridHeader extends React.Component {

  static propTypes = {
    field: React.PropTypes.instanceOf(MdField).isRequired,
    sortObject: React.PropTypes.object,
    conditionObject: React.PropTypes.instanceOf(GridConfigCondition),
    onClickLink: React.PropTypes.func,
    onConditionSet: React.PropTypes.func,
    gridConfig: React.PropTypes.instanceOf(GridConfig).isRequired
  };

  state = {
    showFilterIcon: false,
    showFilterPopover: false,
    conditionObject: null,
    allOperators: null,
    operatorOptions: null,
    conditionSubmitEnabled: false
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      conditionObject: nextProps.conditionObject,
      showFilterIcon: !!nextProps.conditionObject
    });
  }


  _onClickLink = (evt) => {
    let {field, sortObject} = this.props;
    console.log('_onClickLink: %o', field);

    let newSortObject = {
      field: field,
      desc: (sortObject) ? !sortObject.desc : false
    };

    this.props.onClickLink(newSortObject);
  };

  onClickFilter = (evt) => {
    let field = this.props.field;
    console.log('onClickFilter: %o', field);
    let {conditionObject, conditionSubmitEnabled} = this.state;


    if (!conditionObject) {
      conditionObject = new GridConfigCondition(this.props.gridConfig);
      conditionObject.setColumnRef(field);
    }

    let entitiesToFetch = ['FILTEROPERATOR'];
    if (field.valueSource) entitiesToFetch.push(field.valueSource);

    MdEntityService.fetchEntities(entitiesToFetch, {}, _.fill(Array(entitiesToFetch.length), true))
    .then(entityHash => {
      let allOperators = entityHash.FILTEROPERATOR.lovItems;
      let operatorOptions = allOperators.filter(li => _.includes(conditionObject.$columnRef.availableOperators, li.value));

      conditionSubmitEnabled = GridService.validateCondition(conditionObject, [], 0, allOperators);

      this.setState({showFilterPopover: true, conditionObject: conditionObject, allOperators, operatorOptions, conditionSubmitEnabled});
    });
  };

  onChangeConditionOperator(conditionObject, newOperator) {
    console.log('onChangeConditionOperator: ', newOperator, conditionObject);

    conditionObject.operator = newOperator;

    if (newOperator) {
      let operatorLov = this.state.allOperators.find(v => v.value === newOperator);

      if (operatorLov.params[0] === 'N') {
        conditionObject.values = [];
      } else {
        conditionObject.values = new Array(parseInt(operatorLov.params[0]));
      }
    } else {
      conditionObject.values = [];
    }

    let conditionSubmitEnabled = GridService.validateCondition(conditionObject, [], 0, this.state.allOperators);

    this.setState({conditionObject, conditionSubmitEnabled});
  };

  onChangeConditionValues = (conditionObject) => {
    console.log('onChangeConditionValues: condition %o', conditionObject);
    let conditionSubmitEnabled = GridService.validateCondition(conditionObject, [], 0, this.state.allOperators);
    this.setState({conditionObject, conditionSubmitEnabled});
  };


  onMouseOver = (evt) => {
    if (!this.props.conditionObject) this.setState({showFilterIcon: true});
  };
  onMouseOut = (evt) => {
    if (!this.props.conditionObject) this.setState({showFilterIcon: false});
  };
  cancelPopover = (evt) => {
    this.setState({showFilterPopover: false});
  };

  submitCondition = (evt) => {
    evt.preventDefault();
    this.props.onConditionSet(this.state.conditionObject, this.props.field);
    this.setState({showFilterPopover: false});
  };
  clearCondition = (evt) => {
    this.props.onConditionSet(null, this.props.field);
    this.setState({showFilterPopover: false});
  };

  render() {
    let {field, sortObject} = this.props;
    let {conditionObject, operatorOptions, conditionSubmitEnabled} = this.state;

    let tooltipText = field.gridHeaderTooltipActive;

    let desc = (sortObject && sortObject.desc) ? true : false;


    let tooltip = <Tooltip placement="top" id={field.fieldName}>{tooltipText}</Tooltip>;

    let filterPopover = (
      <Overlay
        show={this.state.showFilterPopover}
        onHide={() => this.setState({ showFilterPopover: false })}
        rootClose={true}
        target={()=> React.findDOMNode(this.refs.filterIconRef)}
        placement="bottom">
        <Popover style={{minWidth: 300}}
          title={<span><span>Column Filter</span> <span className="fa fa-close" style={{float: 'right', cursor: 'pointer'}} onClick={this.cancelPopover} ></span></span>}
          id={field.fieldName + '_filter'}>

          {
            (conditionObject) ? (
              <form>
                <StyledSelect name="conditionOperator" value={conditionObject.operator} options={operatorOptions} onChange={this.onChangeConditionOperator.bind(this, conditionObject)}  clearable={false} />
                <div style={{minHeight: 50}}>
                  <ConditionValue condition={conditionObject} onChange={this.onChangeConditionValues}/>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 10}}>
                  <RaisedButton type="submit" onClick={this.submitCondition} label="OK" secondary={true} disabled={!conditionSubmitEnabled}/>
                  <RaisedButton onClick={this.clearCondition} label="Clear" secondary={true} disabled={!this.props.conditionObject}/>
                </div>
              </form>
            ) : ''
          }

        </Popover>
      </Overlay>
    );


    let filter = (
      <a ref="filterIconRef" onClick={this.onClickFilter} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
        <span style={{marginLeft:1}} className={classNames('fa', 'fa-filter', {'invisible': !this.state.showFilterIcon})}/>
      </a>

    );


    let anchor = (
      <a onClick={this._onClickLink} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
        { (sortObject) ? (
          <span className={classNames('fa', {'fa-long-arrow-up': !desc, 'fa-long-arrow-down': desc})}> </span> ) : '' }
        {field.gridHeaderLabelActive}
      </a>
    );

    let anchorWithTooltip = (
      <OverlayTrigger overlay={tooltip} delayShow={300} delayHide={150}>
        { anchor }
      </OverlayTrigger>
    );

    return (

      <span>
        { (tooltipText) ? anchorWithTooltip : anchor}
        { filter }
        { filterPopover }
      </span>


    );
  }


}
