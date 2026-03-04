import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        // Handle theme on mount
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        if (!user) return;

        const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

        socket.on('connect', () => {
            socket.emit('join_room', user._id);
        });

        socket.on('notification', (data) => {
            toast.success(
                <div className="flex flex-col">
                    <strong className="text-sm font-bold text-gray-900">{data.title}</strong>
                    <p className="text-xs text-gray-500 mt-1">{data.message}</p>
                </div>,
                { duration: 6000 }
            );
        });

        return () => socket.disconnect();
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex transition-colors duration-300">
            <Sidebar />

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-dark-950/60 z-40 md:hidden backdrop-blur-md transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar Container */}
            <div className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-dark-900 z-50 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col md:ml-72 min-w-0">
                <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-4 md:p-10 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <Outlet />
                    </div>
                </main>

                <footer className="p-8 text-center text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">
                    &copy; {new Date().getFullYear()} VoiceHU Academic Intelligence Platform • Haramaya University
                </footer>
            </div>
        </div>
    );
};

export default Layout;

