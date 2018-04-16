'use strict';
const Service = require('egg').Service;
const svgCaptcha = require('svg-captcha');
const utility = require('utility');

class CcapService extends Service{
async create () {
    const captcha = svgCaptcha.create();
    return captcha;
};
    async is_enableLogin (username, password) { //  判断用户名 密码是否正确
        // console.log(username, password)
        const is_able = await this.app.mysql.select('user', {where: {username: username, password: utility.sha1(password)}});
        // console.log(!!is_able[0])
        if (!!is_able[0]) {
            return is_able[0];
        } else {
            return false;
        }
    }
    async upDataOnLineUser (cid){
        const { socket, app } = this.ctx;
        const onlineUser = await app.mysql.query('SELECT cid from user_online WHERE cid=' + cid);
        console.log(socket.id)
        if( !!onlineUser[0]) { // 有
            console.log('有');
        } else { // 没有
            await app.mysql.query('INSERT INTO `user_online` ( cid, socket_id) VALUES ( ' + cid + ',"' + socket.id+'")')
        }
    }
};
module.exports = CcapService;