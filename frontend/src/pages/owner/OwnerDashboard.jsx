import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Store as StoreIcon, Users } from 'lucide-react';

const OwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/owner/dashboard');
        setStores(res.data.stores || []);
      } catch (err) {
        console.error('Error fetching owner dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Owner Dashboard</h2>
        <p className="text-gray-500 text-sm">View performance and ratings for your stores</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
      ) : stores.length === 0 ? (
        <div className="formal-card p-12 text-center bg-white">
          <StoreIcon className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Stores Assigned</h3>
          <p className="text-gray-500 text-sm">You don't have any stores assigned to your account yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {stores.map((store, index) => (
            <div
              key={store.id}
              className="formal-card overflow-hidden bg-white"
            >
              {/* Store Header */}
              <div className="bg-gray-50 p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{store.name}</h3>
                  <p className="text-gray-500 text-sm">{store.address}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white px-4 py-2 rounded-md border border-gray-200 flex items-center gap-2 shadow-sm">
                    <Star className="text-amber-500 fill-amber-500" size={20} />
                    <span className="text-lg font-bold text-gray-900">{store.averageRating || 'N/A'}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider ml-1 font-medium">Avg Rating</span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-md border border-gray-200 flex items-center gap-2 shadow-sm">
                    <Users className="text-blue-600" size={20} />
                    <span className="text-lg font-bold text-gray-900">{store.ratedUsers.length}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider ml-1 font-medium">Reviews</span>
                  </div>
                </div>
              </div>

              {/* Users who rated */}
              <div className="p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Recent Reviews</h4>
                {store.ratedUsers.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No ratings submitted yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {store.ratedUsers.map((user, i) => (
                      <div key={i} className="bg-white p-4 rounded-md border border-gray-200 shadow-sm hover:shadow transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star 
                                key={star} 
                                size={14} 
                                className={star <= user.ratingSubmitted ? 'text-amber-500 fill-amber-500' : 'text-gray-300'} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
