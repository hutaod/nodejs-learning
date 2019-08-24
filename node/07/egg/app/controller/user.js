'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async create() {
    const { ctx } = this;
    ctx.body = {
      name: 'hahha',
    };
  }
}

module.exports = UserController;
