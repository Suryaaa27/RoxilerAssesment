const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/ownerController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(restrictTo('OWNER'));

router.get('/dashboard', getDashboard);

module.exports = router;
