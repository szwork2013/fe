import React from 'react';
import { RouteHandler } from 'react-router';

import Mui from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';

import MainMenu from 'core/component/mainMenu';

import styles from 'core/page/application.less';

const ThemeManager = new Mui.Styles.ThemeManager();
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
