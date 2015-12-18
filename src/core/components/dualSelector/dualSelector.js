import React from 'react';
import ReactDOM from 'react-dom';
import {Input} from 'react-bootstrap';
import { RaisedButton, Styles} from 'material-ui';

import styles from 'core/components/dualSelector/dualSelector.less';


const Colors = Styles.Colors;

export default class DualSelector extends React.Component {

  static propTypes = {
    allObjects: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    selectedObjects: React.PropTypes.arrayOf(React.PropTypes.object),
    optionValuePropertyName: React.PropTypes.string.isRequired,
    optionTextPropertyName: React.PropTypes.string.isRequired,

    allObjectsLabel: React.PropTypes.string.isRequired,
    selectedObjectsLabel: React.PropTypes.string.isRequired,

    onAdd: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    onUp: React.PropTypes.func.isRequired,
    onDown: React.PropTypes.func.isRequired
  };

  //static defaultProps = {
  //
  //};

  //state = {
  //};


  /* ****************   EVENT HENDLERS ************************************************************ */


  onClickPridat = () => {
    let selectedColumns = this.refs.allObjectsField.getValue();
    if (selectedColumns && selectedColumns.length > 0) {
      this.props.onAdd(selectedColumns);
      this._selectOptions(this.refs.allObjectsField, 'DESELECT');
    }
  };

  onClickOdstranit = () => {
    let selectedColumns = this.refs.selectedObjectsField.getValue();
    if (selectedColumns && selectedColumns.length > 0) {
      this.props.onDelete(selectedColumns);
      this._selectOptions(this.refs.selectedObjectsField, 'DESELECT');
    }
  };



  onClickUp = () => {
    let selectedColumns = this.refs.selectedObjectsField.getValue();
    if (selectedColumns && selectedColumns.length > 0) {
      this.props.onUp(selectedColumns);
      this._selectOptions(this.refs.selectedObjectsField, 'UP');
    }
  };

  onClickDown = () => {
    let selectedColumns = this.refs.selectedObjectsField.getValue();
    if (selectedColumns && selectedColumns.length > 0) {
      this.props.onDown(selectedColumns);
      this._selectOptions(this.refs.selectedObjectsField, 'DOWN');
    }
  };

  render() {

    let {
      children,
      style,
      allObjects,
      selectedObjects,
      optionValuePropertyName,
      optionTextPropertyName,
      allObjectsLabel,
      selectedObjectsLabel,
      ...other,
      } = this.props;

    let selectedObjectsFixed = (selectedObjects) ? selectedObjects : [];
    let selectedObjectsNames = selectedObjectsFixed.map(v => v.fieldName);
    let allObjectsFiltered = allObjects.filter(v => !selectedObjectsNames.includes(v.fieldName));

    let addButtonStyle = {fontWeight: 'normal', marginTop: 10, marginBottom: 10};
    let sortButtonStyle = {fontWeight: 'normal', width: 40, minWidth: 40};

    return (
      <div className="dualselector">

        <Input className="selectbox" type="select" label={allObjectsLabel} multiple ref="allObjectsField">
          {
            allObjectsFiltered.map( (obj, index) => {
              return (
                <option key={index} value={obj[optionValuePropertyName]}>{obj[optionTextPropertyName]}</option>
              );
            })
          }
        </Input>

        <div className="addbuttons">
          <RaisedButton style={addButtonStyle} onClick={this.onClickPridat}>
            <span style={{lineHeight: '40px'}}> Přidat </span> <span className="fa fa-chevron-right"/>
          </RaisedButton>
          <RaisedButton style={addButtonStyle} onClick={this.onClickOdstranit}>
            <span className="fa fa-chevron-left"/> <span style={{lineHeight: '40px'}}> Odstranit </span>
          </RaisedButton>
        </div>

        <Input className="selectbox" type="select" label={selectedObjectsLabel} multiple ref="selectedObjectsField">
          {
            selectedObjectsFixed.map( (obj, index) => {
              return (
                <option key={index} value={obj[optionValuePropertyName]}>{obj[optionTextPropertyName]}</option>
              );
            })
          }
        </Input>

        <div className="sortbuttons">
          <RaisedButton style={sortButtonStyle} onClick={this.onClickUp}>
            <span style={{lineHeight: '40px'}} className="fa fa-chevron-up"/>
          </RaisedButton>
          <RaisedButton style={sortButtonStyle} onClick={this.onClickDown}>
            <span style={{lineHeight: '40px'}} className="fa fa-chevron-down"/>
          </RaisedButton>
        </div>


      </div>
    )
  }


  _selectOptions(inputRef, action) {
    let inputElement = ReactDOM.findDOMNode(inputRef);
    let selectElement = inputElement.getElementsByTagName('select')[0];

    for (let i=0, iLen=selectElement.options.length; i<iLen; i++) {
      let opt = selectElement.options[i];
      if (opt.selected && action === 'DESELECT') {
        opt.selected = false;
      }
      if (opt.selected && action === 'UP') {
        if (i > 0) {
          opt.selected = false;
          selectElement.options[i-1].selected = true;
        }
      }
    }
    let iLen = selectElement.options.length;
    for (let i=iLen-1; i>=0; i--) {
      let opt = selectElement.options[i];
      if (opt.selected && action === 'DOWN') {
        if (i < iLen-1) {
          opt.selected = false;
          selectElement.options[i+1].selected = true;
        }
      }
    }

  }

}

