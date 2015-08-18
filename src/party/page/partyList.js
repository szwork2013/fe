import React from 'react';
import {State} from 'react-router';
import reactMixin from 'react-mixin';

import PageAncestor from 'core/common/page/pageAncestor';

@reactMixin.decorate(State)
export default class PartyList extends PageAncestor {

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  }


  // neni nutne
  //constructor(props, context){
  //  super(props);
  //  console.log('context.router %o', context.router);
  //}

  render() {
    var name = this.context.router.getCurrentPath();
    var name2 = this.getPath();

    return (
        <h1>Party list ! <i className="fa fa-cubes"></i>
          {name}
          <br/>
          {name2}
        </h1>
      );
  }

}

//reactMixin(PartyList.prototype, State);


