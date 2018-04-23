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
            socket.broadcast.to(roomId).emit('message', this.ctx.args);
        // });
        console.log(nsp.adapter.rooms)
    }
    async bindName() { // 更新用户登录信息
        const { socket } = this.ctx;
        // console.log(this.ctx.args[0])
        this.ctx.service.ccap.upDataOnLineUser(this.ctx.args[0].cid, socket.id);
    }
    // async addroom() { // 将用户预备分配进某一组
    //     const roomId = this.ctx.args[0].roomId;
    //     console.log(roomId)
    //     // const cid = this.ctx.args[0].cid;
    //     const nsp = this.app.io.of('/user');
    //     const cidList = roomId.split('_');
    //     for ( let i = 0, l = cidList.length; i < l; i++ ) {
    //             const socketResult = await this.service.ccap.selectSocketId(cidList[i]);
    //             if (!!socketResult) nsp.to(socketResult.socket_id).emit('addroomIng',{roomId: roomId});
    //     }
    // }
    async editroom() {
        const { roomId, oldRoomId } = this.ctx.args[0];
        const cidList = roomId.split('_');
        const oldCidList = oldRoomId.split('_');
        const nsp = this.app.io.of('/user');
        const removeList = [];
        const addList = [];
        if (oldRoomId != '_') {
            for(let i = 0,l =oldCidList.length; i< l; i++ ){ // 提出room
                const socketResult = await this.service.ccap.selectSocketId(oldCidList[i]);
                if (!!socketResult) nsp.to(socketResult.socket_id).emit('removeroomIng',{roomId: roomId, oldRoomId: oldRoomId, type: 'all'});
            }
        }
        for(let i = 0,l =cidList.length; i< l; i++ ){ // 加入room
            // if (!oldCidList.includes(cidList[i])) {
                addList.push(cidList[i]);
                const socketResult = await this.service.ccap.selectSocketId(cidList[i]);
                if (!!socketResult) nsp.to(socketResult.socket_id).emit('addroomIng',{roomId: roomId, oldRoomId: oldRoomId});
            // }
        }
    }
    async deleteRoom() {
        const { roomId, isMaster, cid } = this.ctx.args[0];
        const nsp = this.app.io.of('/user');
        const cidList = roomId.split('_');
        if (roomId != '_' && !!isMaster) { // 删除房间
            for(let i = 0,l =cidList.length; i< l; i++ ){ // 提出room
                const socketResult = await this.service.ccap.selectSocketId(cidList[i]);
                if (!!socketResult) nsp.to(socketResult.socket_id).emit('removeroomIng',{roomId: roomId, oldRoomId: roomId, isMaster: isMaster, cid: cid, type: 'all'});
            }
        }else if (!isMaster){ // 退出房间
            const socketResult = await this.service.ccap.selectSocketId(cid);
            if (!!socketResult) nsp.to(socketResult.socket_id).emit('removeroomIng',{roomId: roomId, oldRoomId: roomId, isMaster: isMaster, cid: cid, type: 'one'});
        }
    }
    async removeroomIng() {
        const { roomId, oldRoomId, isMaster, type } = this.ctx.args[0];
        const arg = this.ctx.args[0];
        // console.log(roomId)
        this.ctx.socket.leave(oldRoomId);
        const nsp = this.app.io.of('/user');
        if (type == 'all') {
            nsp.to(this.ctx.socket.id).emit('removeroomed', { code: 0, message: 'ok', ...arg});
        }
    }
    async addroomIng() { // 将用户添加入某一组
        const { roomId, oldRoomId } = this.ctx.args[0];
        // console.log(roomId)
        this.ctx.socket.join(roomId);
        const nsp = this.app.io.of('/user');
        nsp.to(this.ctx.socket.id).emit('addroomed',{code:0, message: 'ok', roomId: roomId, oldRoomId: oldRoomId});
        // console.log(nsp.adapter.rooms)
    }
    async saveStatus(){ // 保存用户登录信息
        const { app, ctx } = this;
        console.log(ctx.args[0])
    }
    async getuser() { // 获取在线用户
        const userList =  await this.ctx.service.ccap.getOnlineUser();
        this.app.io.of('/user').emit('getuser', userList);
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