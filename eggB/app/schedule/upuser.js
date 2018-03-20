module.exports = {
    schedule: {
      interval: '5m', // 1 分钟间隔
      type: 'all', // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
        const cc = await ctx.service.user.say();
        console.log(cc)
    //   ctx.service.user.say();
    },
  };