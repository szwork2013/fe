import React from 'react';
import {State} from 'react-router';
import reactMixin from 'react-mixin';
import When from 'when';

import PageAncestor from 'core/common/page/pageAncestor';


@reactMixin.decorate(State)
export default class PartyDetail extends PageAncestor {

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  };




  render() {

    return (
        <h1>Party Detail</h1>
    );
  }

}



