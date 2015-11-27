let Colors = require('material-ui/lib/styles/colors');
let ColorManipulator = require('material-ui/lib/utils/color-manipulator');
let Spacing = require('material-ui/lib/styles/spacing');

export const muiRawTheme = {
  spacing: Spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {

    primary1Color: Colors.indigo500,
    primary2Color: Colors.indigo700,
    primary3Color: Colors.indigo100,
    accent1Color: Colors.pinkA200,
    accent2Color: Colors.pinkA400,
    accent3Color: Colors.pinkA100,

    //// MUI doc
    textColor: Colors.darkBlack,
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
    iconButtonSize: 40
  }

};

export function customizeTheme(muiTheme, muiThemeCustomization) {
  for(let componentKey in muiThemeCustomization) {
    if (muiTheme[componentKey]) {
      Object.assign(muiTheme[componentKey], muiThemeCustomization[componentKey]);
    } else {
      muiTheme[componentKey] = muiThemeCustomization[componentKey];
    }
  }
}
