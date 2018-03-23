module.exports = {
    schedule: {
      interval: '1s', // 1 分钟间隔
      type: 'all', // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
      // console.log(this.session)
        const cc = await ctx.service.user.say();
    //   ctx.service.user.say();
    },
  };