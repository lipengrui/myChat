module.exports = () => {
    return async function verifyUser(ctx, next) {
        await next();
        // console.log(ctx.session)
    }
}