import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="formal-card mx-6 mt-6 px-6 py-4 flex justify-between items-center z-10 sticky top-6 bg-slate-50">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center font-bold text-lg text-white shadow-sm">
          R
        </div>
        <h1 className="text-xl font-bold text-gray-900">
          RoxilerAssesment
        </h1>
      </div>
      
      {user && (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-700">
            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center border border-gray-200">
              <UserIcon size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">{user.role}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-gray-50 rounded transition-colors flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium hidden sm:block">Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
