import React, { useState } from 'react';
import { HiOutlineBell, HiOutlineSearch, HiOutlineMenuAlt2 } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const TopBar = ({ onMenuClick }) => {
    const { user } = useAuth();
    const [searchValue, setSearchValue] = useState('');

    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg md:hidden"
                >
                    <HiOutlineMenuAlt2 className="w-6 h-6" />
                </button>

                <div className="relative hidden sm:block">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search complaints..."
                        className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl w-64 md:w-96 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
                <Link to="/notifications" className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl relative transition-all">
                    <HiOutlineBell className="w-6 h-6" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </Link>

                <Link to="/settings" className="flex items-center space-x-3 p-1 md:p-1.5 hover:bg-gray-100 rounded-xl transition-all">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-semibold text-gray-900 leading-none">{user?.name}</div>
                        <div className="text-xs text-gray-500 capitalize leading-none mt-1">{user?.role}</div>
                    </div>
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-primary-100 text-primary-700 rounded-xl flex items-center justify-center font-bold text-lg overflow-hidden border border-primary-200">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.charAt(0)
                        )}
                    </div>
                </Link>
            </div>
        </header>
    );
};

export default TopBar;
