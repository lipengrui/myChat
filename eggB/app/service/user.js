'use strict';

module.exports = app => {
  class User extends app.Service {
    async say() {
      console.log(this.ctx.session)
      return await this.ctx.session.logintime;
    }
  }
  return User;
};