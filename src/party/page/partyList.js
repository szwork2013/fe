import React from 'react';
import {State} from 'react-router';
import reactMixin from 'react-mixin';
import When from 'when';

import PageAncestor from 'core/common/page/pageAncestor';
import GridService from 'core/grid/service/gridService';


@reactMixin.decorate(State)
export default class PartyList extends PageAncestor {

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  }

  static fetchData(params) {
    console.log("PartyList#fetchData(%o)", params);
    return GridService.getGridConfigs('party|Party', 'partyList');
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


