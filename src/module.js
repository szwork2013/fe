// Bootstrapping module
import React from 'react';
import Router from 'react-router';
import routes from 'routes';

import CommonService from 'core/common/service/commonService';



Router.run(routes, Router.HistoryLocation, (Root, state) => {

  console.debug('router run');


  CommonService.emitter.emit('loadStart');

  React.render(<Root {...state}/>, document.getElementById("content"));




});
