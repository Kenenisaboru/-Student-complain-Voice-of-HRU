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
    HiOutlineTag,
    HiOutlineShieldCheck
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', icon: HiOutlineViewGrid, path: '/dashboard' },
        { name: 'Complaints', icon: HiOutlineChatAlt2, path: '/complaints' },
        { name: 'Notifications', icon: HiOutlineBell, path: '/notifications', badge: 3 },
    ];

    if (user?.role === 'admin' || user?.role === 'staff') {
        menuItems.push(
            { name: 'Analytics', icon: HiOutlineChartBar, path: '/analytics' },
            { name: 'Categories', icon: HiOutlineTag, path: '/categories' }
        );
    }

    if (user?.role === 'admin') {
        menuItems.push(
            { name: 'User Management', icon: HiOutlineUserGroup, path: '/users' },
            { name: 'System Logs', icon: HiOutlineShieldCheck, path: '/logs' }
        );
    }

    const bottomItems = [
        { name: 'Support', icon: HiOutlineSupport, path: '/support' },
        { name: 'Settings', icon: HiOutlineCog, path: '/settings' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-72 bg-white dark:bg-dark-900 border-r border-gray-100 dark:border-gray-800 z-30 hidden md:flex flex-col transition-all duration-300">
            {/* Logo Area */}
            <div className="p-8">
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="w-12 h-12 bg-gradient-to-tr from-primary-600 to-secondary-500 rounded-2xl flex items-center justify-center text-white shadow-glow transition-transform group-hover:scale-105 duration-300">
                        <span className="text-2xl font-black italic tracking-tighter">V</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white leading-none">VoiceHU</span>
                        <span className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em] mt-1">Platform Pro</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-8 mt-4 overflow-y-auto">
                <section>
                    <div className="text-[11px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] px-4 mb-4">Main Menu</div>
                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                hide-on-collapse="true"
                                to={item.path}
                                className={({ isActive }) =>
                                    `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`
                                }
                            >
                                <item.icon className={`w-5 h-5 transition-colors ${item.badge ? 'relative' : ''}`} />
                                <span className="flex-1">{item.name}</span>
                                {item.badge && (
                                    <span className="bg-primary-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[18px] text-center">
                                        {item.badge}
                                    </span>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="text-[11px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] px-4 mb-4">System</div>
                    <div className="space-y-1">
                        {bottomItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </div>
                </section>
            </nav>

            {/* User Profile Summary */}
            <div className="p-4 m-4 bg-gray-50 dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold border border-primary-200 shadow-sm overflow-hidden">
                        {user?.avatar ? <img src={user.avatar} alt="" /> : user?.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider truncate">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center justify-center space-x-2 w-full px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20"
                >
                    <HiOutlineLogout className="w-4 h-4" />
                    <span>Terminate Session</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

