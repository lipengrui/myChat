'use strict'
const Controller = require('egg').Controller;

class DefaultController extends Controller {
    async connect() {
        const { ctx, app } = this;
        const message = '哎呀不懂啊';
        console.log('sdfsdff')
        await ctx.socket.emit('loginStatus','hi 我是李鹏瑞' + message);
    }
    async message() {
        const {  socket  } = this.ctx;
        const id = socket.id;
        const nsp = this.app.io.of('/user');
        // const room = this.ctx.args[2];
        const room = '300'
        const rooms = [ room ];
        socket.join(room);
        console.log(id)
    //     const { ctx, app } = this ;
    //     const roomId = ctx.args[2];
    //     const nsp = this.app.io.of('/user');
    //     // ctx.socket.join
    //     // await ctx.socket.broadcast.emit('message', ctx.args);
        // nsp.adapter.clients(rooms, (err, clients) => {
            // 更新在线用户列表
            nsp.to(room).emit('message', {

              action: 'join',
              target: 'participator',
              message: `User(${id}) joined.`,
            });
        // });
    }
    async bindName() {
        console.log(this.ctx.args[0])
    }
    async saveStatus(){ // 保存用户登录信息
        const { app, ctx } = this;
        console.log(ctx.args[0])
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