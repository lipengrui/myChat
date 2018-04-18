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
        const {  roomId } = this.ctx.args[0];
        const nsp = this.app.io.of('/user');
        // const room = this.ctx.args[2];
    //     const { ctx, app } = this ;
    //     const roomId = ctx.args[2];
    //     const nsp = this.app.io.of('/user');
    //     // ctx.socket.join
    //     // await ctx.socket.broadcast.emit('message', ctx.args);
        // nsp.adapter.clients(rooms, (err, clients) => {
            // 更新在线用户列表
            nsp.to(roomId).emit('message', this.ctx.args);
        // });
    }
    async bindName() { // 更新用户登录信息
        const { socket } = this.ctx;
        // console.log(this.ctx.args[0])
        this.ctx.service.ccap.upDataOnLineUser(this.ctx.args[0].cid, socket.id);
    }
    async addroom() { // 将用户预备分配进某一组
        const roomId = this.ctx.args[0].roomId;
        // const cid = this.ctx.args[0].cid;
        const nsp = this.app.io.of('/user');
        const cidList = roomId.split('_');
        for ( let i = 0, l = cidList.length; i < l; i++ ) {
                const socketResult = await this.service.ccap.selectSocketId(cidList[i]);
                // console.log(socketResult.socket_id)
                nsp.to(socketResult.socket_id).emit('addroomIng',{roomId: roomId});
        }
    }
    async addroomIng() { // 将用户添加入某一组
        const { roomId } = this.ctx.args[0];
        // console.log(roomId)
        this.ctx.socket.join(roomId);
        const nsp = this.app.io.of('/user');
        nsp.to(this.ctx.socket.id).emit('addroomed',{code:0, message: 'ok', roomId: roomId});
        // console.log(nsp.adapter.rooms)
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