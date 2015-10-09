import React from 'react';
import {State} from 'react-router';
import reactMixin from 'react-mixin';

import PageAncestor from 'core/common/page/pageAncestor';


@reactMixin.decorate(State)
export default class VehicleDetail extends PageAncestor {

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  };




  render() {

    return (
        <h1>Vehicle Detail</h1>
    );
  }

}



