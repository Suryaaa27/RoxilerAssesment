import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Star, Edit2 } from 'lucide-react';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStores = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/stores?search=${search}`);
      setStores(res.data);
    } catch (error) {
      console.error('Error fetching stores', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStores();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleRate = async () => {
    if (ratingValue < 1 || ratingValue > 5) return;
    setIsSubmitting(true);
    try {
      if (selectedStore.myRating) {
        await axios.put(`http://localhost:5000/api/user/ratings/${selectedStore.myRatingId}`, { rating: ratingValue });
      } else {
        await axios.post('http://localhost:5000/api/user/ratings', { storeId: selectedStore.id, rating: ratingValue });
      }
      setSelectedStore(null);
      setRatingValue(0);
      fetchStores();
    } catch (error) {
      console.error('Error submitting rating', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openRatingModal = (store) => {
    setSelectedStore(store);
    setRatingValue(store.myRating || 0);
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Store Directory</h2>
          <p className="text-gray-500 text-sm">Find and rate your favorite stores</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search stores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded py-2 pl-10 pr-4 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store, index) => (
            <div
              key={store.id}
              className="formal-card p-6 hover:border-blue-300 transition-colors group flex flex-col"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{store.name}</h3>
              <p className="text-gray-500 text-sm mb-4 truncate" title={store.address}>{store.address}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <Star className="text-amber-500 fill-amber-500" size={18} />
                  <span className="font-semibold text-gray-900">{store.averageRating || 'New'}</span>
                </div>
                
                <button
                  onClick={() => openRatingModal(store)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    store.myRating 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200' 
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  {store.myRating ? (
                    <>
                      <Edit2 size={14} />
                      My Rating: {store.myRating}
                    </>
                  ) : (
                    <>
                      <Star size={14} />
                      Rate Now
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
          {stores.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500">
              No stores found matching your search.
            </div>
          )}
        </div>
      )}

      {/* Rating Modal */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="formal-card w-full max-w-sm p-6 bg-white">
            <h3 className="text-xl font-bold text-gray-900 mb-2 border-b border-gray-100 pb-2">
              {selectedStore.myRating ? 'Update Rating' : 'Rate Store'}
            </h3>
            <p className="text-gray-500 text-sm mb-6">How would you rate {selectedStore.name}?</p>
            
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingValue(star)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    size={36} 
                    className={`${ratingValue >= star ? 'text-amber-500 fill-amber-500' : 'text-gray-300'} transition-colors`} 
                  />
                </button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedStore(null)}
                className="flex-1 py-2 rounded font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRate}
                disabled={!ratingValue || isSubmitting}
                className="flex-1 py-2 rounded font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
