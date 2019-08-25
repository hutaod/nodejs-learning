'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  console.log(controller.user.create);
  router.get('/', controller.home.index);
  router.get('/user', controller.user.create);
  router.get('/user/add', controller.user.add);
};
