'use strict'
const Controller = require('egg').Controller;

class DefaultController extends Controller {
    async index() {
        const { ctx, app } = this;
        const message = '哎呀不懂啊';
        console.log('sdfsdff')
        await ctx.socket.emit('loginStatus','hi 我是李鹏瑞' + message);
    }
}
module.exports = DefaultController;

// exports.ping = async function() {
//     const message = 'sdfff';
//     console.log('ping')

//     await this.socket.emit('res', `Hi! I've got your message: ${message}`);
//   };
  
  // module.exports = app => {
  //   class Controller extends app.Controller {
  //     async index() {
  //       const message = this.ctx.args[0];
  //       console.log('chat :', message + ' : ' + process.pid);
  //       const say = await this.ctx.service.user.say();
  //       this.ctx.socket.emit('res', say);
  //     }
  //   }
  //   return Controller;
  // };