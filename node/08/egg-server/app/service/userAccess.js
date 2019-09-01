'use strict';

const Service = require('egg').Service;

class UserAccessService extends Service {
  async login(payload) {
    const { ctx, service } = this;
    const user = await service.user.findByMobile(payload.mobile);
    if (!user) {
      ctx.throw(404, '找不到用户');
    }

    const verifyPsw = await ctx.compare(payload.password, user.password);
    if (!verifyPsw) {
      ctx.throw(404, '用户密码错误');
    }
    // 生成token令牌
    return { token: await service.actionToken.apply(user._id) };
  }

  async logout() {
    // 登出
  }

  async current() {
    const { ctx, service } = this;
    // ctx.state.user 可以提取到JWT编码的data
    const _id = ctx.state.user.data._id;
    const user = await service.user.find(_id);
    if (!user) {
      ctx.throw(404, 'user is not found');
    }
    user.password = 'How old are you?';
    return user;
  }
}

module.exports = UserAccessService;
