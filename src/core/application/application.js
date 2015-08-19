import React from 'react';
import { RouteHandler } from 'react-router';

import Mui from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';

import MainMenu from 'core/mainmenu/mainMenu';

import styles from 'core/application/application.less';

const ThemeManager = new Mui.Styles.ThemeManager();
const Colors = Mui.Styles.Colors;

ThemeManager.setPalette({
  primary1Color: Colors.indigo500,
  primary2Color: Colors.indigo700,
  primary3Color: Colors.indigo100,
  accent1Color: Colors.pinkA200,
  accent2Color: Colors.pinkA400,
  accent3Color: Colors.pinkA100
});

injectTapEventPlugin();


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
    var { loading } = this.props;
    return <div className={styles.this + (loading ? ' ' + styles.loading : '')}>
      <div className={styles.loadingElement}>loading...</div>
      <MainMenu />
      <RouteHandler />
    </div>;
  }
}
