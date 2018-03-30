// app.js
// const LocalStrategy = require('passport-local').Strategy;
module.exports = app => {
  // 挂载 strategy
  // app.passport.use(new LocalStrategy({
  //   passReqToCallback: true,
  // }, (req, username, password, done) => {
  //   // format user
  //   const user = {
  //     provider: 'local',
  //     username,
  //     password,
  //   };
  //   // debug('%s %s get user: %j', req.method, req.url, user);
  //   app.passport.doVerify(req, user, done);
  // }));

  // // 处理用户信息
  // app.passport.verify(async (ctx, user) => {return true});
  // app.passport.serializeUser(async (ctx, user) => {});
  // app.passport.deserializeUser(async (ctx, user) => {});

  // app.sessionStore = {
  //   async get(key) {
  //     const res = await app.redis.get(key);
  //     if (!res) return null;
  //     return JSON.parse(res);
  //   },

  //   async set(key, value, maxAge) {
  //     console.log(12)
  //     console.log(key)
  //     console.log(value);
  //     console.log(maxAge)
  //     // maxAge not present means session cookies
  //     // we can't exactly know the maxAge and just set an appropriate value like one day
  //     if (!maxAge) maxAge =  1 * 60 * 1000;
  //     value = JSON.stringify(value);
  //     await app.redis.set(key, value, 'PX', maxAge);
  //   },

  //   async destroy(key) {
  //     await app.redis.del(key);
  //   },
  // };

}