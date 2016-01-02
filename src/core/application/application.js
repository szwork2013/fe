import React from 'react';
import { RouteHandler } from 'react-router';
import { ToastContainer, ToastMessage } from 'react-toastr';
import injectTapEventPlugin from 'react-tap-event-plugin';

import ThemeManager from 'material-ui/lib/styles/theme-manager';
import {muiRawTheme, muiThemeCustomization, customizeTheme}  from 'core/common/config/mui-theme';
import commonService from 'core/common/service/commonService';
import MainMenu from 'core/mainmenu/mainMenu';

import 'core/application/application.less';



const ToastMessageFactory = React.createFactory(ToastMessage.animation);



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
      muiTheme: this.muiTheme
    };
  }

  state = {
    loading: false
  };

  componentWillMount() {
    this.muiTheme = ThemeManager.getMuiTheme(muiRawTheme);
    customizeTheme(this.muiTheme, muiThemeCustomization);
  }


  componentDidMount() {
    // set our internal variable to a reference to an instance of the growler
    commonService.toastr = this.refs.toastrRef;
    commonService.router = this.context.router;
    commonService.emitter.on('LOADING', (isOn) => {
      let [loading] = isOn;
      console.log('LOADING listener: ', loading );
      if( this.state.loading ? !loading : loading ) {
        this.setState({loading});
      }

    });
  };

  componentWillUnmount() {
    commonService.emmiter.removeAllListeners('LOADING');
  }


  render() {


    var devtools = '';
    if (__REDUXDEVTOOLS__) {
      const DevTools = require('core/common/redux/devtools').default;
      devtools = <DevTools />;
    }

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
        {devtools}
      </div>
    )
  }
}
