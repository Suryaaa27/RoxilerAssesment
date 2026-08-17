import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Store as StoreIcon, Star, Plus, Search } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [activeTab, setActiveTab] = useState('stores'); // 'stores', 'users', 'addStore', 'addUser'
  
  // Data states
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({});
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/stores?search=${search}`);
      setStores(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/users?search=${search}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'stores') fetchStores();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab, search]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e, type) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });
    try {
      if (type === 'store') {
        await axios.post('http://localhost:5000/api/admin/stores', formData);
        setFormMsg({ type: 'success', text: 'Store added successfully!' });
      } else {
        await axios.post('http://localhost:5000/api/admin/users', formData);
        setFormMsg({ type: 'success', text: 'User added successfully!' });
      }
      setFormData({});
      fetchStats();
      e.target.reset();
    } catch (err) {
      setFormMsg({ type: 'error', text: err.response?.data?.message || 'Error occurred' });
    }
  };

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="formal-card p-6 flex items-center gap-4">
      <div className={`p-4 rounded-full ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} colorClass="bg-blue-100 text-blue-600" />
        <StatCard title="Total Stores" value={stats.totalStores} icon={StoreIcon} colorClass="bg-indigo-100 text-indigo-600" />
        <StatCard title="Total Ratings" value={stats.totalRatings} icon={Star} colorClass="bg-amber-100 text-amber-600" />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {['stores', 'users', 'addStore', 'addUser'].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setFormMsg({ type: '', text: '' }); }}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
              activeTab === tab 
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="formal-card p-6 min-h-[400px]">
        {(activeTab === 'stores' || activeTab === 'users') && (
          <div className="mb-6 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-gray-300 rounded-md py-2 pl-10 pr-4 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="overflow-x-auto">
            
            {activeTab === 'stores' && (
              <table className="w-full text-left text-sm border-collapse">
                <thead className="text-gray-600 border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Store Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Address</th>
                    <th className="px-4 py-3 font-medium text-right">Avg Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-700">
                  {stores.map(store => (
                    <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{store.name}</td>
                      <td className="px-4 py-3">{store.email}</td>
                      <td className="px-4 py-3">{store.address}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-200">
                          <Star size={12} className="fill-amber-500 text-amber-500" /> {store.averageRating || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {stores.length === 0 && <tr><td colSpan="4" className="py-8 text-center text-gray-500">No stores found</td></tr>}
                </tbody>
              </table>
            )}

            {activeTab === 'users' && (
              <table className="w-full text-left text-sm border-collapse">
                <thead className="text-gray-600 border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Address</th>
                    <th className="px-4 py-3 font-medium text-right">Store Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-700">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.role === 'ADMIN' ? 'bg-red-100 text-red-700 border border-red-200' :
                          user.role === 'OWNER' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-green-100 text-green-700 border border-green-200'
                        }`}>{user.role}</span>
                      </td>
                      <td className="px-4 py-3 truncate max-w-[200px]">{user.address}</td>
                      <td className="px-4 py-3 text-right">
                        {user.role === 'OWNER' ? (
                           <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-200">
                           <Star size={12} className="fill-amber-500 text-amber-500" /> {user.storeRating || 'N/A'}
                         </span>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && <tr><td colSpan="5" className="py-8 text-center text-gray-500">No users found</td></tr>}
                </tbody>
              </table>
            )}

            {(activeTab === 'addStore' || activeTab === 'addUser') && (
              <div className="max-w-xl mx-auto py-4">
                <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                  {activeTab === 'addStore' ? 'Add New Store' : 'Add New User'}
                </h3>
                
                {formMsg.text && (
                  <div className={`p-4 rounded mb-6 ${formMsg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    {formMsg.text}
                  </div>
                )}

                <form onSubmit={(e) => handleAddSubmit(e, activeTab === 'addStore' ? 'store' : 'user')} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input required type="text" name="name" onChange={handleInputChange} className="w-full bg-slate-50 border border-gray-300 rounded py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input required type="email" name="email" onChange={handleInputChange} className="w-full bg-slate-50 border border-gray-300 rounded py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input required type="text" name="address" onChange={handleInputChange} className="w-full bg-slate-50 border border-gray-300 rounded py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  
                  {activeTab === 'addUser' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input required type="password" name="password" onChange={handleInputChange} className="w-full bg-slate-50 border border-gray-300 rounded py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select name="role" onChange={handleInputChange} defaultValue="USER" className="w-full bg-slate-50 border border-gray-300 rounded py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                          <option value="USER">Normal User</option>
                          <option value="ADMIN">Admin</option>
                          <option value="OWNER">Store Owner</option>
                        </select>
                      </div>
                    </>
                  )}

                  {activeTab === 'addStore' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Owner ID (Optional User ID)</label>
                      <input type="text" name="ownerId" onChange={handleInputChange} className="w-full bg-slate-50 border border-gray-300 rounded py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                  )}

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors mt-4 flex items-center justify-center gap-2">
                    <Plus size={18} /> Add {activeTab === 'addStore' ? 'Store' : 'User'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
