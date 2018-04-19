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
  app.io.of('/user').route('saveStatus', app.io.controller.user.saveStatus);
  app.io.of('/user').route('bindName', app.io.controller.user.bindName);
  app.io.of('/user').route('editroom', app.io.controller.user.addroom);
  app.io.of('/user').route('addroomIng', app.io.controller.user.addroomIng);
  app.io.of('/user').route('removeroomIng', app.io.controller.user.addroomIng);
  app.io.of('/user').route('getuser', app.io.controller.user.getuser);
    // app.io.of('/chat')
    // app.io.of('/chat').route('chat', app.io.controller.chat.index);
};
