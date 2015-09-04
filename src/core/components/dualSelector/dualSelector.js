import React from 'react';
import {Input} from 'react-bootstrap';
import { RaisedButton, FontIcon, Styles} from 'material-ui';

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
    onDelete: React.PropTypes.func.isRequired
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
    }
  };

  onClickOdstranit = () => {
    let selectedColumns = this.refs.selectedObjectsField.getValue();
    if (selectedColumns && selectedColumns.length > 0) {
      this.props.onDelete(selectedColumns);
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
    let allObjectsFiltered = allObjects.filter(v => !_.includes(selectedObjectsNames, v.fieldName));

    let buttonStyle = {fontWeight: 'normal', marginTop: 10, marginBottom: 10};

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

        <div className="buttons">
          <RaisedButton style={buttonStyle} onClick={this.onClickPridat}>
            <span style={{lineHeight: '40px'}}> Přidat </span> <span className="fa fa-chevron-right"/>
          </RaisedButton>
          <RaisedButton style={buttonStyle} onClick={this.onClickOdstranit}>
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


      </div>
    )
  }


}

