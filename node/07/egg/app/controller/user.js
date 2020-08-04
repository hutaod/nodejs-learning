'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // ctx.body = 'hi, egg222';
    ctx.body = await ctx.service.user.getAll();
  }

  async add() {
    const { ctx } = this;
    // ctx.body = 'hi, egg222';
    const index = Math.floor(Math.random() * 3);
    ctx.body = await ctx.model.User.create({
      name: [ '🍎', '🍆', '🚀' ][index],
    });
  }
}

module.exports = HomeController;
