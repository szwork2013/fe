import React from 'react';
import { RouteHandler } from 'react-router';

import {Styles} from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';

import MainMenu from 'core/mainmenu/mainMenu';

import styles from 'core/application/application.less';

const ThemeManager = new Styles.ThemeManager();
const Colors = Styles.Colors;

ThemeManager.setPalette({
  primary1Color: Colors.indigo500,
  primary2Color: Colors.indigo700,
  primary3Color: Colors.indigo100,
  accent1Color: Colors.pinkA200,
  accent2Color: Colors.pinkA400,
  accent3Color: Colors.pinkA100
});

ThemeManager.setComponentThemes({
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
    iconButtonSize: 40,
  },

});


injectTapEventPlugin();

  try {
    React.createClass({});
  } catch(e) {
    console.log('REACT IS RUNNING IN ' + ((e.message.indexOf('render') >= 0)?'DEV':'PROD') + ' MODE');
  }




export default class Application extends React.Component {

  static childContextTypes = {
    muiTheme: React.PropTypes.object
  };

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }


  render() {
    return (
      <div id="content">
        <MainMenu />
        <RouteHandler />
      </div>
    )
  }
}
