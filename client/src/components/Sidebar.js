import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
    HiOutlineViewGrid,
    HiOutlineChatAlt2,
    HiOutlineBell,
    HiOutlineUserGroup,
    HiOutlineChartBar,
    HiOutlineCog,
    HiOutlineLogout,
    HiOutlineSupport,
    HiOutlineTag
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', icon: HiOutlineViewGrid, path: '/dashboard' },
        { name: 'Complaints', icon: HiOutlineChatAlt2, path: '/complaints' },
        { name: 'Notifications', icon: HiOutlineBell, path: '/notifications' },
    ];

    if (user?.role === 'admin') {
        menuItems.push(
            { name: 'Analytics', icon: HiOutlineChartBar, path: '/analytics' },
            { name: 'Users', icon: HiOutlineUserGroup, path: '/users' },
            { name: 'Categories', icon: HiOutlineTag, path: '/categories' }
        );
    }

    const bottomItems = [
        { name: 'Support', icon: HiOutlineSupport, path: '/support' },
        { name: 'Settings', icon: HiOutlineCog, path: '/settings' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-20 hidden md:flex flex-col">
            <div className="p-6">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
                        <span className="text-xl font-bold italic">V</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">VoiceHU</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Main Menu</div>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-primary-50 text-primary-600 shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}

                <div className="pt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">System</div>
                {bottomItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-primary-50 text-primary-600 shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                >
                    <HiOutlineLogout className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
