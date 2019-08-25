'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async create() {
    const { ctx } = this;
    // ctx.body = {
    //   name: 'hahha',
    // };
    ctx.body = await ctx.service.user.getAll();
  }

  async add() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.addOne();
  }
}

module.exports = UserController;
