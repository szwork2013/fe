import React from 'react';
import {partial} from 'lodash';

const Colors = require('material-ui/lib/styles/colors');
const Typography = require('material-ui/lib/styles/typography');
const ColorManipulator = require('material-ui/lib/utils/color-manipulator');
const Spacing = require('material-ui/lib/styles/spacing');
const zIndex = require('material-ui/lib/styles/zIndex');


export const muiRawTheme = {
  spacing: Spacing,
  fontFamily: 'Roboto+Condensed, sans-serif',
  zIndex: zIndex,
  palette: {

    primary1Color: Colors.indigo500,
    primary2Color: Colors.indigo700,
    primary3Color: Colors.indigo100,
    accent1Color: Colors.pinkA200,
    accent2Color: Colors.pinkA400,
    accent3Color: Colors.pinkA100,

    //// MUI doc
    textColor: '#666',
    alternateTextColor: Colors.white,
    canvasColor: Colors.white,
    borderColor: Colors.grey300,
    disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3)

    //// MD generator
    //textColor: Colors.grey900,
    //alternateTextColor: '#727272',
    //borderColor: '#B6B6B6'

  }
};

export const muiThemeCustomization = {
  toolbar: {
    backgroundColor: Colors.blueGrey50,
    height: 40,
    titleFontSize: 20
  },
  tableRowColumn: {
    height: 28,
    spacing: 16
  },
  tableHeaderColumn: {
    height: 28,
    spacing: 16
  },
  button: {
    height: 40,
    iconButtonSize: 40,
    textTransform: 'none'
  }

};

export function customizeTheme(muiTheme, muiThemeCustomization) {
  for (let componentKey in muiThemeCustomization) {
    if (muiTheme[componentKey]) {
      Object.assign(muiTheme[componentKey], muiThemeCustomization[componentKey]);
    } else {
      muiTheme[componentKey] = muiThemeCustomization[componentKey];
    }
  }
}

export function customizeThemeForDetail(muiTheme) {
  customizeTheme(muiTheme, {
    floatingActionButton: {
      /*  buttonSize: 56, */
      miniSize: 30
    },
    tabs: {
      backgroundColor: 'white',
      textColor: Typography.textLightBlack,
      selectedTextColor: Typography.textDarkBlack
    }
  })
}


export const TabTemplate = React.createClass({

  render() {
    let styles = {
      'width': '100%',
      minHeight: 0,
      flexGrow: 1
    };

    if (this.props.selected) {
      styles.display = 'flex';
    } else {
      styles.display = 'none';
    }

    return (
      <div style={styles}>
        {this.props.children}
      </div>
    );
  }
});

