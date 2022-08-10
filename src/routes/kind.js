const router = require('express').Router();
const kindController = require('../controllers/kindController');
const middleWareController = require('../controllers/middleWareController');

router.post('/create',middleWareController.verifyAdmin,kindController.createKind);
router.delete('/delete/:id',middleWareController.verifyAdmin,kindController.deleteKind);
router.get('/:slug',kindController.getOne);
router.get('/',kindController.getAll);

module.exports = router;