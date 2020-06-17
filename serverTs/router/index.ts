import Router from 'koa-router';
import file from './file';
import template from './template';
import code from './code';

const document = require('./document');
const configlist = require('./configlist');

const router = new Router();

router.get('*', async (ctx, next) => {
    if (ctx.response.status === 404 && ctx.request.path.indexOf('api') === -1) {
        ctx.response.redirect('/');
    } else {
        next();
    }
});

router.use('/api/file', file.routes());
router.use('/api/template', template.routes());
router.use('/api/code', code.routes());
router.use('/api/document', document.routes());
router.use('/api/configlist', configlist.routes());

export default router;
