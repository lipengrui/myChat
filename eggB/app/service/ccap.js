'use strict';
const Service = require('egg').Service;
const svgCaptcha = require('svg-captcha');
const utility = require('utility');

class CcapService extends Service{
    async create(){
        const captcha = svgCaptcha.create();
        return captcha;
    }
    async is_enableLogin(username, password) {
        // console.log(username, password)
        const is_able = await this.app.mysql.select('user', {where: {username: username, password: utility.sha1(password)}});
        // console.log(!!is_able[0])
        if(!!is_able[0]){
            return is_able[0];
        }else {
            return false;
        }
    }
}
module.exports = CcapService;