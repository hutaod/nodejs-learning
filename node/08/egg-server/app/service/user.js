'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  /**
   * 创建用户
   * @param {*} payload 用户信息
   */
  async create(payload) {
    const { ctx } = this;
    payload.password = await ctx.genHash(payload.password);
    return await ctx.model.User.create(payload);
  }

  /**
   * 删除用户
   * @param {*} _id 用户id
   */
  async destory(_id) {
    const { ctx } = this;
    for (const key in ctx) {
      if (ctx.hasOwnProperty(key)) {
        console.log(key);
      }
    }
    const user = await ctx.service.user.find(_id);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    return ctx.model.User.findByIdAndRemove(_id);
  }

  /**
   * 修改用户信息
   * @param {*} _id 用户id
   * @param {*} payload 用户信息
   */
  async update(_id, payload) {
    const { ctx, service } = this;
    const user = await service.find(_id);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    return ctx.model.User.findByIdAndUpdate(_id, payload);
  }

  /**
   * 查看单个用户
   * @param {*} _id 用户id
   */
  async show(_id) {
    const { ctx } = this;
    const user = await ctx.service.find(_id);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    return ctx.model.User.findById(_id).populate('role');
  }

  /**
   * 查看用户列表
   * @param {*} payload 用户id
   */
  async list(payload) {
    const { ctx } = this;
    const { current, pageSize, isPaging, search } = payload;
    const res = {
      list: [],
      pageSize: Number(pageSize || 10),
      count: 0,
      total: await ctx.model.User.count({}).exec(),
      current: Number(current) || 1,
    };
    const skip = (Number(current) - 1) * Number(pageSize || 10);
    if (isPaging) {
      if (search) {
        res.list = await ctx.model.User.find({
          mobile: {
            $regex: search,
          },
        })
          .populate('role')
          .skip(skip)
          .limit(Number(pageSize))
          .sort({ createdAt: -1 })
          .exec();
        res.count = res.list.length;
      } else {
        res.list = await ctx.model.User.find({})
          .populate('role')
          .skip(skip)
          .limit(Number(pageSize))
          .sort({ createdAt: -1 })
          .exec();
        res.count = res.total;
      }
    } else {
      if (search) {
        res.list = await ctx.model.User.find({
          mobile: {
            $regex: search,
          },
        })
          .populate('role')
          .sort({ createdAt: -1 })
          .exec();
        res.count = res.list.length;
      } else {
        res.list = await ctx.model.User.find({})
          .populate('role')
          .sort({ createdAt: -1 })
          .exec();
        res.count = res.total;
      }
    }
    // 整理数据
    res.list = res.list.map((e, i) => {
      const jsonObject = Object.assign({}, e._doc);
      jsonObject.key = i;
      delete jsonObject.password;
      jsonObject.createdAt = this.ctx.helper.formatTime(e.createdAt);
      return jsonObject;
    });

    return res;
  }

  /**
   * 删除多个用户
   * @param {*} payload
   */
  async removes(payload) {
    return this.ctx.model.User.remove({ _id: { $in: payload } });
  }

  /**
   * 根据手机号查找
   * @param {*} mobile 手机号
   */
  async findByMobile(mobile) {
    return this.ctx.model.User.findOne({ mobile });
  }

  /**
   * 查找用户
   * @param {*} id 用户id
   */
  async find(id) {
    return this.ctx.model.User.findById(id);
  }

  /**
   * 更新用户信息
   * @param {*} id 用户id
   * @param {*} values 用户更新信息
   */
  async findByIdAndUpdate(id, values) {
    return this.ctx.model.User.findByIdAndUpdate(id, values);
  }
}

module.exports = UserService;
