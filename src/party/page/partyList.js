import React from 'react';

export default class PartyList extends React.Component {

  static willTransitionTo(transition, params, query) {
    console.log('willTransitionTo: transition = %o, params = %o, query = %o', transition, params, query);
  }

  static willTransitionFrom(transition, component) {
    console.log('willTransitionFrom: transition = %o, component = %o, query = %o', transition, component);
  }

  render() {
    return (
        <h1>Party list ! <i className="fa fa-cubes"></i></h1>
      );
  }

}


