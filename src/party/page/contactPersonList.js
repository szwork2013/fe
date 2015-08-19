import React from 'react';
import {State} from 'react-router';
import reactMixin from 'react-mixin';

import PageAncestor from 'core/common/page/pageAncestor';

@reactMixin.decorate(State)
export default class ContactPersonList extends PageAncestor {


  render() {
    var name = this.getPath();

    return (
        <h1>Contact Person list
          {name}
        </h1>
      );
  }

}



