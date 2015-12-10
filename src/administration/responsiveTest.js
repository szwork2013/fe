import React from 'react';
import {TextField} from 'material-ui';

import StyledDatePicker from 'core/components/styledDatePicker/styledDatePicker';
import NumberInput from 'core/components/numberInput/numberInput';
import PageAncestor from 'core/common/page/pageAncestor';
import Toolmenu from 'core/components/toolmenu/toolmenu';

export default class ResponsiveTest extends PageAncestor {

  static title = 'Responsive Test';
  static icon = 'home';

  state = this._createSizeObject();

  _createSizeObject() {
    var widths = {
      screenWidth: window.screen.width,
      viewportWidth: window.innerWidth,
      bodyClientWidth: document.body.clientWidth,
      documentClientWidth: document.documentElement.clientWidth
    };
    console.log('widths: ', widths);
    return widths;
  }

  onResize = (evt) => {
    this.setState(this._createSizeObject());
  };

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }


  render() {

    const {screenWidth, viewportWidth, bodyClientWidth, documentClientWidth} = this.state;

    return (

      <main className="main-content">
        <Toolmenu>
          <div>
            window.screen.width: {screenWidth}
          </div>
          <div>
            window.innerWidth: {viewportWidth}
          </div>
          <div>
            document.body.clientWidth: {bodyClientWidth}
          </div>
          <div>
            document.documentElement.clientWidth: {documentClientWidth}
          </div>
        </Toolmenu>
        <form>
            <div className="row" >
              <div className="col-xs-12" >
                <div className="box" style={{backgroundColor: 'blue', color: 'white', marginTop:10}}>
                  col-xs  &lt; 768px
                </div>
              </div>
            </div>
            <div className="row" >
              <div className="col-xs-12">
                <div className="box" style={{backgroundColor: 'blue', color: 'white'}}>
                  768px &lt;= col-sm  &lt; 992px
                </div>
              </div>
            </div>
            <div className="row" >
              <div className="col-xs-12">
                <div className="box" style={{backgroundColor: 'blue', color: 'white'}}>
                  992px &lt;= col-md  &lt; 1200px
                </div>
              </div>
            </div>
            <div className="row" >
              <div className="col-xs-12">
                <div className="box" style={{backgroundColor: 'blue', color: 'white'}}>
                  1200px &lt;= col-lg
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12">
                <div className="box" style={{backgroundColor: 'lightGrey', marginTop:10,marginBottom:10}}>
                  col-xs-12
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-8">
                <div className="box" style={{backgroundColor: 'lightGrey', marginTop:10,marginBottom:10}}>
                  col-xs-12 col-sm-8
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-8 col-md-6">
                <div className="box" style={{backgroundColor: 'lightGrey', marginTop:10,marginBottom:10}}>
                  col-xs-12 col-sm-8 col-md-6
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-8 col-md-6 col-lg-4">
                <div className="box" style={{backgroundColor: 'lightGrey', marginTop:10,marginBottom:10}}>
                  col-xs-12 col-sm-8 col-md-6 col-lg-4
                </div>
              </div>
            </div>

            <hr/>

            <div className="row">
              <div className="col-xs-12 col-md-6 col-lg-4">
                <div className="box" style={{backgroundColor: 'yellow', marginTop:10,marginBottom:10}}>
                  col-xs-12 col-sm-8 col-md-6 col-lg-4
                </div>
              </div>
              <div className="col-xs-12  col-md-6 col-lg-4">
                <div className="box" style={{backgroundColor: 'yellow', marginTop:10,marginBottom:10}}>
                  col-xs-12 col-sm-8 col-md-6 col-lg-4
                </div>
              </div>
              <div className="col-xs-12 col-md-6 col-lg-4">
                <div className="box" style={{backgroundColor: 'yellow', marginTop:10,marginBottom:10}}>
                  col-xs-12 col-sm-8 col-md-6 col-lg-4
                </div>
              </div>
            </div>


          <StyledDatePicker defaultValue={new Date()} culture='en' style={{marginRight: '20px'}} />
          <TextField defaultValue={'1000'} />
          <NumberInput />


        </form>
      </main>
    )
      ;
  }

}
