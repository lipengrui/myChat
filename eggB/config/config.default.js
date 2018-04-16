'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1520842634508_9265';
  // config.keys = '123';

  // add your config here
  config.middleware = [
    'saveSession',
    'verifyUser'
  ];
  config.security = {
    csrf: {
      enable: false,
      // cookieName: 'sfd',
      // ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
      bodyName: 'user'
    },
    // methodnoallow:{
    //   enable: true
    // },
    domainWhiteList: [ 'http://localhost:8080', 'http://localhost:80', 'http://192.168.1.26:8080' ]
  };
  config.cors = {
    // origin: '*',
    allowMethods: 'GET,POST',
    credentials: true
  }
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  }
  config.mysql = {
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: '',
      database: 'mytest',
    },
    app: true,
  }
  config.io = {
    namespace: {
      // '/': {
      //   connectionMiddleware: [ 'auth' ],
      //   packetMiddleware: [ 'filter' ],
      // },
      '/user': {
        connectionMiddleware: [ 'auth' ],
        packetMiddleware: [],
      },
    },
  }
  // config.redis = {
  //   client: {
  //     // cc: {
  //       host: '127.0.0.1',
  //       port: '6379',
  //       password: '',
  //       db: 0
  //     // }
  //   }
  // }
  return config;
};
// module.exports.cluster = {
//   listen: {
//     port: 7001,
//     hostname: '192.168.1.17',
//   }
// };
