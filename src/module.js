// Bootstrapping module
import React from 'react';
import Router from 'react-router';
import routes from 'routes';
import When from 'when/keys';

import CommonService from 'core/common/service/commonService';



Router.run(routes, Router.HistoryLocation, (Root, state) => {

  console.debug('router run');
  CommonService.emitter.emit('loadStart');

  const routes = state.routes;
  const lastRoute = routes[routes.length - 1];

  document.title =  lastRoute.handler.title;  // 'ZZ ' + routes.map(r => r.handler.title).join(' / ');


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
