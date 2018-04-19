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
    async upDataOnLineUser (cid, socket_id) { // 更新用户登录状态
        const onlineUser = await this.app.mysql.query('SELECT cid from user_online WHERE cid=' + cid);
        if( !!onlineUser[0]) { // 有
            await this.app.mysql.query('UPDATE `user_online` set socket_id = "' + socket_id + '" WHERE cid = ' + cid );
        } else { // 没有
            await this.app.mysql.query('INSERT INTO `user_online` ( cid, socket_id) VALUES ( ' + cid + ',"' + socket_id+'")')
        }
    }
    async selectSocketId (cid) { // 获得该用户的socket_id
        const socket_id_cid = await this.app.mysql.query('SELECT socket_id FROM user_online WHERE cid= ' + cid);
        // let socket_id_cid = await this.app.mysql.select('user_online', {where: {cid: cid}});
        return socket_id_cid[0]
    }
    async getOnlineUser() {
        const onlineUser = await this.app.mysql.query('SELECT user.cid, user.username from user , user_online WHERE user_online.cid = user.cid');
        return onlineUser;
    }
};
module.exports = CcapService;