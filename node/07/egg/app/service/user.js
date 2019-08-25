'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async getAll() {
    // return [{ name: 'haha' }];
    return await this.ctx.model.User.findAll();
  }

  async addOne() {
    return await this.ctx.model.User.create({
      name: 'haha' + Date.now(),
    });
  }
}

module.exports = UserService;
