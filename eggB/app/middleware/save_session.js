module.exports = () => {
    return async function saveSession (ctx, next) {
        await next();
        if (!ctx.session) {
            return ;
        }else {
            ctx.session.save();
        }
    }
}