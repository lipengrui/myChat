'use strict';
const lodash = require('lodash');
const utility = require('utility');
const Controller = require('egg').Controller;
class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
  }
  async getuser() {
    // const datalist = {
    //   list: [{ csrf: this.ctx.csrf }]
    // };
    const ctx= this.ctx;
    const token = this.ctx.csrf;
    // if (ctx.cookies.get('user')){
    //   console.log(ctx.cookies.get('user'))
    // }
    // this.ctx.cookies.set('token', token);
    // console.log(ctx.cookies.get('c_user'))

    // if(!!this.ctx.session.data) {
    //   // this.ctx.body = { code: 0, message: '登陆成功',  data: this.ctx.session.data }
    //   this.ctx.body = { code: 0, message: '登陆成功' }
    //   return;
    // }else {
    //   this.ctx.body = { code: 1, message: '未登录' }
    // }

    // this.ctx.body = {csrf: token, success: true};
    // this.app.mysql.query('INSERT INTO user (name,password) VALUES (1,123123)');
    // await this.ctx.render('home.tpl', datalist);
    const userList = await this.ctx.service.ccap.getOnlineUser();
    // const userList = await this.app.mysql.query('SELECT cid, username from USER');
    this.ctx.body = { code : 0, data: userList };

  }
  async exit() {
    const cid = this.ctx.params.cid;
    if (!cid){
      this.ctx.body = { code : 1, message: 'cid 未传'}
      return;
    }else {
    const is_drop =  await this.ctx.service.ccap.outLine(cid);
    if (is_drop){
      this.ctx.body = { code : 0, message: '成功退出'}
      this.ctx.session = null;
    }
    }
  }
  async login() {
    const { username, password, is_record } = this.ctx.request.body;
    if (!!username && !!password) {
        const userData = await this.ctx.service.ccap.is_enableLogin(username, password);
        if(!!userData) {
          const nowTime = new Date().getTime();
          if( !!userData.logintime && nowTime > userData.logintime){
            // console.log(this.app);
            // console.log(this.ctxs);
          };
          await this.app.mysql.query('UPDATE user SET logintime = ' + nowTime +' WHERE CID = ' + userData.cid);
          this.ctx.session.cid = userData['cid'];
          this.ctx.session.username = userData['username'];
          this.ctx.session.logintime = nowTime;
          this.ctx.session.data = userData;
          this.ctx.body = {code: 0, message: '登录成功', cid: userData['cid'] , username: userData['username'] }
          // if(is_record){
          //   this.ctx.session.maxAge = 10 * 24 * 60 * 60 * 1000
          // }else {
          //   // 登录失效时长
          //   this.ctx.session.maxAge = 1 * 10 * 1000;
          // }
          this.app.login_name = username;
          return;
        }else {
          this.ctx.body = { code: 103 , message: '用户名或密码错误'}
          return;
        }
      // this.app.mysql.insert('user', { name: this.ctx.request.body.name, password: this.ctx.request.body.password });
      // const u_id = await this.app.mysql.select('user', { where: {
      //   name: this.ctx.request.body.name, password: this.ctx.request.body.password
      // },
      // columns:  [ 'id' ] });
      // String(u_id[0].id)
      // this.ctx.cookies.set('c_user', 'sdfsdf',{
      //   maxAge: 600000,
      //   httpOnly: false,
      //   signed: true,
      //   encrypt: true,
      // });
      // console.log(ctx.cookies.get('c_user'))
      // this.ctx.session['d_user'] = u_id[0].id;
      return;
    }else {
      this.ctx.body = { code: 100, message: '缺少参数'};
      return;
    }

    // console.log(this.ctx.session['d_user'])
    // console.log(this.ctx.cookies.get('token'))
    // this.ctx.response.setContentType('Appliction/json');
    this.ctx.body = {"a":"sds"};
  }
  async getCapicha() {
    const data = await this.ctx.service.ccap.create();
    const origin = this.ctx.header.origin + new Date().getTime();
      this.ctx.session.user = origin;
      this.ctx.session.text = data.text;
      this.ctx.session.maxAge = 1 * 60 * 1000;
    // console.log(this.ctx.session)
    this.ctx.body = data;
  }

  async register() {
    const { username, password , resure, vail } = this.ctx.request.body;
    const sessionVail = this.ctx.session.text;
    console.log(this.ctx.session)
    if (!username|| !password ||!resure || !vail) {
      this.ctx.body = { code: 100, message: '缺少参数' }
      return;
    }else if (password != resure){
      this.ctx.body = { code: 101, message: '确认密码不一致' }
      return;
    }else if (lodash.toLower(vail) != lodash.toLower(sessionVail)) {
      this.ctx.body = { code: 102, message: '验证码错误' }
      return;
    } 
    const is_username = await this.app.mysql.select('user',{where: { username: username }});
    // console.log(is_username[0])
    if (!!is_username[0]) {
      this.ctx.body = { code: 300, message: '用户名已存在'};
      return;
    }
      await this.app.mysql.insert('user', {username: username, password: utility.sha1(password), passtext: password})
      this.ctx.body = {code:0, message: 'ok'}
  
    // console.log(this.ctx.session)
  }
} 
module.exports = HomeController;
