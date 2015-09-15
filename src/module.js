// Bootstrapping module
import React from 'react';
import Router from 'react-router';
import routes from 'routes';
import When from 'when/keys';

import CommonService from 'core/common/service/commonService';



Router.run(routes, Router.HistoryLocation, (Root, state) => {

  console.debug('router run');
  CommonService.emitter.emit('loadStart');

  document.title = 'ZZ ' + state.routes.map(r => r.name).join(' / ');

  var promises = state.routes.filter((route) => route.handler.fetchData)
    .reduce((promises, route) => {
      promises[route.name] = route.handler.fetchData(state.params);
      return promises;
    }, {});

  When.all(promises)
    .then((data) => {
      React.render(<Root {...state} data={data}/>, document.body);
    })

});
