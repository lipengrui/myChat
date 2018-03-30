// module.exports = app => {
//     return async (ctx, next) => {
//         console.log("T")
//         ctx.socket.emit('res', 'connected!');
//         await next();
//     }
// }

'use strict';

module.exports = () => {
  return async (ctx, next) => {
    // console.log(123)
    // const userData = await ctx.service.user.say();
    const userData = await ctx.session;
    ctx.socket.emit('loginStatus', JSON.stringify(userData));
    await next();
  };
};