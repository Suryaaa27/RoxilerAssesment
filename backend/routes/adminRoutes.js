const express = require('express');
const router = express.Router();
const { getDashboardStats, addUser, addStore, getStores, getUsers } = require('../controllers/adminController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(restrictTo('ADMIN'));

router.get('/dashboard', getDashboardStats);
router.post('/users', addUser);
router.post('/stores', addStore);
router.get('/stores', getStores);
router.get('/users', getUsers);

module.exports = router;
