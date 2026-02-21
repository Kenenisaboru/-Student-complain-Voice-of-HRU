import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-white z-40 transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col md:ml-64 min-w-0">
                <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
