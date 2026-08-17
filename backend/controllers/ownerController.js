const { Store, Rating, User } = require('../models');

exports.getDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Get the store for this owner
    const stores = await Store.findAll({
      where: { ownerId },
      include: [
        { 
          model: Rating, 
          as: 'ratings', 
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }] 
        }
      ]
    });

    if (!stores.length) {
      return res.json({ stores: [], message: 'No stores assigned to this owner' });
    }

    const dashboardData = stores.map(store => {
      const storeData = store.toJSON();
      const sum = storeData.ratings.reduce((acc, curr) => acc + curr.rating, 0);
      storeData.averageRating = storeData.ratings.length ? (sum / storeData.ratings.length).toFixed(1) : 0;
      
      // Extract users who rated
      storeData.ratedUsers = storeData.ratings.map(r => ({
        id: r.user.id,
        name: r.user.name,
        email: r.user.email,
        ratingSubmitted: r.rating
      }));

      delete storeData.ratings;
      return storeData;
    });

    res.json({ stores: dashboardData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
