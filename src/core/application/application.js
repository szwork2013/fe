import React from 'react';
import { RouteHandler } from 'react-router';

import { ToastContainer, ToastMessage } from 'react-toastr';

import {Styles} from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';

import commonService from 'core/common/service/commonService';
import MainMenu from 'core/mainmenu/mainMenu';

import styles from 'core/application/application.less';

const ThemeManager = new Styles.ThemeManager();
const Colors = Styles.Colors;

const ToastMessageFactory = React.createFactory(ToastMessage.animation);

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



// detekce react modu
  try {
    React.createClass({});
  } catch(e) {
    console.log('REACT IS RUNNING IN ' + ((e.message.indexOf('render') >= 0)?'DEV':'PROD') + ' MODE');
  }




export default class Application extends React.Component {

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  };

  static childContextTypes = {
    muiTheme: React.PropTypes.object
  };


  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  state = {
    loading: false
  };


  componentDidMount() {
    // set our internal variable to a reference to an instance of the growler
    commonService.toastr = this.refs.toastrRef;
    commonService.router = this.context.router;
    commonService.emitter.on('LOADING', (isOn) => {
      let [loading] = isOn;
      console.log('LOADING listener: ', loading );
      this.setState({loading});
    });
  };

  componentWillUnmount() {
    commonService.emmiter.removeAllListeners('LOADING');
  }


  render() {
    return (
      <div id="content">

        {
          (this.state.loading) ? (
            <div className="loading loading--overlay">
              <div className="loading__content loading__content--overlay">
                <p className="sr-only">Loading the view...</p>
                <i className="fa fa-4x fa-spinner fa-spin"></i>
              </div>
            </div>
          ) : ''
        }


        <MainMenu />
        <RouteHandler />
        <ToastContainer ref="toastrRef"
                        toastMessageFactory={ToastMessageFactory}
                        className="toast-top-right" />
      </div>
    )
  }
}
