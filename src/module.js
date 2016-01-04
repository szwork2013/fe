// Bootstrapping module
import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
//import monitor from 'when/monitor/console';  // advanced promise exceptions
import When from 'when/keys';
import {Provider} from 'react-redux';

import immutableConfig from 'core/common/config/immutable-config';
import {store} from 'core/common/redux/store';
import routes from 'routes';

import CommonService from 'core/common/service/commonService';





// router

Router.run(routes, Router.HistoryLocation, (Root, state) => {

  console.debug('router run');
  CommonService.emitter.emit('loadStart');

  const routes = state.routes;
  const lastRoute = routes[routes.length - 1];

  document.title =  (lastRoute) ? lastRoute.handler.title : undefined;  // 'ZZ ' + routes.map(r => r.handler.title).join(' / ');

  var promises = state.routes.filter((route) => route.handler.fetchData)
    .reduce((promises, route) => {
      promises[route.name] = route.handler.fetchData(state.params, state.query);
      return promises;
    }, {});

  When.all(promises)
    .then((data) => {
        ReactDOM.render(
          <Provider store={store} key="provider">
            <Root {...state}/>
          </Provider>, document.body);
    });

});
