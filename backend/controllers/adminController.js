const { User, Store, Rating } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'USER' } });
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      address,
      role: role || 'USER'
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const storeExists = await Store.findOne({ where: { email } });
    if (storeExists) {
      return res.status(400).json({ message: 'Store already exists with this email' });
    }

    const store = await Store.create({
      name, email, address, ownerId
    });

    res.status(201).json(store);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getStores = async (req, res) => {
  try {
    // Allows searching and filtering
    const { search } = req.query;
    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const stores = await Store.findAll({
      where: whereClause,
      include: [{ model: Rating, as: 'ratings' }],
      order: [['name', 'ASC']]
    });

    // Calculate average rating
    const storesWithRating = stores.map(store => {
      const storeData = store.toJSON();
      const sum = storeData.ratings.reduce((acc, curr) => acc + curr.rating, 0);
      storeData.averageRating = storeData.ratings.length ? (sum / storeData.ratings.length).toFixed(1) : 0;
      delete storeData.ratings; // Don't need to send all ratings
      return storeData;
    });

    res.json(storesWithRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let whereClause = {
      role: { [Op.in]: ['USER', 'ADMIN', 'OWNER'] } // Explicitly asking for normal and admin users, I included owner too
    };

    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } },
          { role: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      include: [{ model: Store, as: 'stores', include: [{ model: Rating, as: 'ratings' }] }],
      order: [['name', 'ASC']]
    });

    // Format for owners if any
    const usersFormatted = users.map(user => {
      const userData = user.toJSON();
      if (userData.role === 'OWNER') {
        const ownedStores = userData.stores || [];
        const avgRating = ownedStores.map(store => {
          const sum = store.ratings.reduce((a, b) => a + b.rating, 0);
          return store.ratings.length ? sum / store.ratings.length : 0;
        });
        const totalAvg = avgRating.length > 0 ? (avgRating.reduce((a, b) => a + b, 0) / avgRating.length).toFixed(1) : 0;
        userData.storeRating = totalAvg;
      }
      delete userData.stores;
      return userData;
    });

    res.json(usersFormatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
