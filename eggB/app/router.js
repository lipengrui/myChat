'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const saveSession = app.middleware.saveSession();
  const verifyUser = app.middleware.verifyUser();
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/getuser', saveSession, controller.home.getuser);
  router.post('/login', controller.home.login);
  router.get('/register', controller.home.getCapicha);
  router.post('/register', saveSession, controller.home.register);
  router.get('/exit', verifyUser, controller.home.exit);
  app.io.of('/user').route('user', app.io.controller.user.index);
  app.io.of('/user').route('message', app.io.controller.user.message);
    // app.io.of('/chat')
    // app.io.of('/chat').route('chat', app.io.controller.chat.index);
};
