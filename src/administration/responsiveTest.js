import React from 'react';

import PageAncestor from 'core/common/page/pageAncestor';
import Toolmenu from 'core/components/toolmenu/toolmenu';

export default class ResponsiveTest extends PageAncestor {

  static title = 'Responsive Test';
  static icon = 'home';

  state = {
    screenWidth: window.screen.width
  };

  onResize = (evt) => {
    console.log('onResize: ', window.screen.width);
    this.setState({
      screenWidth: window.screen.width
    });
  };

  componentDidMount() {
    console.log('componentDidMount');
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  render() {

    const {screenWidth} = this.state;

    return (

      <main className="main-content">
        <Toolmenu>
          <div>
            SCREEN WIDTH: {screenWidth}
          </div>
        </Toolmenu>
        <form>
          <div className="container-fluid">
            <div className="row">

            </div>
          </div>
        </form>
      </main>
    )
      ;
  }

}
