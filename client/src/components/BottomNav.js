import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    HiOutlineViewGrid,
    HiOutlineChatAlt2,
    HiOutlineBell,
    HiOutlineChartBar,
    HiOutlineCog
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
    const { user } = useAuth();

    if (!user) return null;

    const navItems = [
        { name: 'Dashboard', icon: HiOutlineViewGrid, path: '/dashboard' },
        { name: 'Complaints', icon: HiOutlineChatAlt2, path: '/complaints' },
        { name: 'Alerts', icon: HiOutlineBell, path: '/notifications' },
    ];

    if (user.role === 'admin' || user.role === 'staff') {
        navItems.push({ name: 'Intelligence', icon: HiOutlineChartBar, path: '/analytics' });
    }

    navItems.push({ name: 'Terminal', icon: HiOutlineCog, path: '/settings' });

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/70 dark:bg-dark-950/70 backdrop-blur-2xl border-t border-gray-100 dark:border-gray-800 flex md:hidden items-center justify-around px-4 z-[45] transition-colors duration-300 pb-safe shadow-nav-mobile">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center space-y-1 group relative flex-1 h-full px-2 transition-all duration-300 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`
                    }
                >
                    {({ isActive }) => (
                        <>
                            {isActive && (
                                <span className="absolute -top-[1.5px] inset-x-4 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full shadow-glow-sm" />
                            )}
                            <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 scale-110 shadow-sm' : 'group-hover:bg-gray-50 dark:group-hover:bg-dark-800'}`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                                {item.name}
                            </span>
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
};

export default BottomNav;
