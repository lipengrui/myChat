'use strict';

// had enabled by egg
// exports.static = true;
exports.cors = {
  enable: true,
  package: 'egg-cors',
};
exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks'
};
exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};
exports.sessionRedis = {
  enable: false,
  package: 'egg-session-redis',
};
exports.io = {
  enable: true,
  package: 'egg-socket.io'
};
// exports.redis = {
//   enable: true,
//   package: 'egg-redis',
// }