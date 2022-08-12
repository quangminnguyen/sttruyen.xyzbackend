const router = require('express').Router();
const chapterController = require('../controllers/chapterController');
const middleWareController = require('../controllers/middleWareController');


router.post('/create/:slug',middleWareController.verifyAdmin,chapterController.createChapter);
router.post('/delete/:id',middleWareController.verifyAdmin,chapterController.deleteChapter);
router.put('/update/:id',middleWareController.verifyAdmin,chapterController.updateChapter);

module.exports = router;