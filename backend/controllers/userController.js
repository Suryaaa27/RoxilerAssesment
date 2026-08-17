const { Store, Rating } = require('../models');
const { Op } = require('sequelize');

exports.getStores = async (req, res) => {
  try {
    const { search } = req.query;
    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const stores = await Store.findAll({
      where: whereClause,
      include: [{ model: Rating, as: 'ratings' }],
      order: [['name', 'ASC']]
    });

    const userId = req.user.id;

    // Calculate average rating and user's specific rating
    const storesData = stores.map(store => {
      const storeData = store.toJSON();
      const sum = storeData.ratings.reduce((acc, curr) => acc + curr.rating, 0);
      storeData.averageRating = storeData.ratings.length ? (sum / storeData.ratings.length).toFixed(1) : 0;
      
      const userRating = storeData.ratings.find(r => r.userId === userId);
      storeData.myRating = userRating ? userRating.rating : null;
      storeData.myRatingId = userRating ? userRating.id : null;

      delete storeData.ratings; // Remove all ratings to keep payload clean
      return storeData;
    });

    res.json(storesData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const existingRating = await Rating.findOne({ where: { storeId, userId } });
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this store. Please modify your existing rating.' });
    }

    const newRating = await Rating.create({ storeId, userId, rating });
    res.status(201).json(newRating);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.modifyRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const existingRating = await Rating.findOne({ where: { id: ratingId, userId } });
    if (!existingRating) {
      return res.status(404).json({ message: 'Rating not found or not yours to modify.' });
    }

    existingRating.rating = rating;
    await existingRating.save();

    res.json(existingRating);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
