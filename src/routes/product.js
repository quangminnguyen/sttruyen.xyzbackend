const router = require('express').Router();
const middleWareController = require('../controllers/middleWareController');
const productController = require('../controllers/productController');

router.post('/create',middleWareController.verifyAdmin,productController.createProduct);
router.put('/update/:slug',middleWareController.verifyAdmin,productController.updateProduct);
router.delete('/delete/:slug',middleWareController.verifyAdmin,productController.deleteProduct);
router.get('/default',productController.getDefaultProduct);
router.get('/:slug',productController.getOne);
router.get('/',productController.getProduct);

module.exports = router;