import React from 'react';
import PageAncestor from 'core/common/page/pageAncestor';

export default class Home extends PageAncestor {

  static title = 'Zauzoo Home';
  static icon = 'home';

  render() {
    return (
      <main className="main-content">
        <h1>Home !</h1>
      </main>

    )
      ;
  }

}
