const product = require('./product');
const user = require('./user');
const kind = require('./kind');
const chapter = require('./chapter');

function router(app){
    app.use('/product',product);
    app.use('/user',user);
    app.use('/kind',kind);
    app.use('/chapter',chapter);
}

module.exports = router;