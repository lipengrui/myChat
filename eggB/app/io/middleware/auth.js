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
    const say = await ctx.service.user.say();
    ctx.socket.emit('res', 'auth!' + say);
    await next();
  };
};