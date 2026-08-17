const express = require('express');
const router = express.Router();
const { getStores, submitRating, modifyRating } = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(restrictTo('USER'));

router.get('/stores', getStores);
router.post('/ratings', submitRating);
router.put('/ratings/:ratingId', modifyRating);

module.exports = router;
