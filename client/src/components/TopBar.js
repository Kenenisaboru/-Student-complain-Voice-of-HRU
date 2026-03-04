import React, { useState, useEffect } from 'react';
import { HiOutlineBell, HiOutlineSearch, HiOutlineMenuAlt2, HiOutlineSun, HiOutlineMoon, HiOutlineBadgeCheck } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const TopBar = ({ onMenuClick }) => {
    const { user } = useAuth();
    const [searchValue, setSearchValue] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.classList.contains('dark') ||
        localStorage.getItem('theme') === 'dark'
    );

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    return (
        <header className="h-[72px] bg-white/70 dark:bg-dark-950/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between transition-colors duration-300">
            <div className="flex items-center space-x-6">
                <button
                    onClick={onMenuClick}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl md:hidden"
                >
                    <HiOutlineMenuAlt2 className="w-6 h-6" />
                </button>

                {/* Enhanced Search Bar */}
                <div className="relative hidden lg:block group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <HiOutlineSearch className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Quick search... (Alt+S)"
                        className="block w-[400px] pl-11 pr-4 py-2.5 bg-gray-50/50 dark:bg-dark-800/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl text-sm transition-all focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white dark:focus:bg-dark-800 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <span className="flex items-center px-1.5 py-0.5 border border-gray-200 dark:border-gray-600 rounded text-[10px] font-bold text-gray-400">
                            ⌘ K
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-3 md:space-x-5">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all relative group"
                >
                    {isDarkMode ? (
                        <HiOutlineSun className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                    ) : (
                        <HiOutlineMoon className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
                    )}
                </button>

                {/* Notifications */}
                <Link to="/notifications" className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl relative transition-all group">
                    <HiOutlineBell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="notification-dot"></span>
                </Link>

                <div className="h-8 w-px bg-gray-100 dark:bg-gray-800 mx-1 hidden sm:block"></div>

                {/* User Profile */}
                <Link to="/settings" className="flex items-center space-x-3 p-1 pl-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all group">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs font-black text-gray-900 dark:text-white leading-none flex items-center justify-end gap-1 uppercase tracking-tight">
                            {user?.name}
                            <HiOutlineBadgeCheck className="w-3.5 h-3.5 text-primary-500" />
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{user?.role}</div>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-tr from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center font-black text-lg border border-primary-200/50 dark:border-primary-500/20 shadow-sm relative shrink-0">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            user?.name?.charAt(0)
                        )}
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-dark-900 shadow-sm"></span>
                    </div>
                </Link>
            </div>
        </header>
    );
};

export default TopBar;

