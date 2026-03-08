import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
    HiOutlineBell,
    HiOutlineCheckCircle,
    HiOutlineTrash,
    HiOutlineChatAlt,
    HiOutlineArrowNarrowRight,
    HiOutlineLightningBolt
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unreadCount);
        } catch (err) {
            toast.error('Signal intercept failure: Notifications unavailable');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            toast.success('All signals synchronized to read state');
        } catch (err) {
            toast.error('Action failure');
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
            toast.success('Signal purged from registry');
        } catch (err) {
            toast.error('Purge failure');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'new_response': return <HiOutlineChatAlt className="w-5 h-5 text-blue-500" />;
            case 'complaint_resolved': return <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500" />;
            case 'complaint_submitted': return <HiOutlineLightningBolt className="w-5 h-5 text-indigo-500" />;
            default: return <HiOutlineBell className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
                        System <span className="text-gradient">Signals</span>
                        {unreadCount > 0 && (
                            <span className="bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-glow-sm animate-pulse-slow">
                                {unreadCount} Active
                            </span>
                        )}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Real-time status updates from the academic grievance matrix.</p>
                </div>
                {notifications.length > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="btn-outline px-6 py-3 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 group"
                    >
                        <HiOutlineCheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Synchronize All
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 card shimmer"></div>
                        ))}
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {notifications.map((n, idx) => (
                            <div
                                key={n._id}
                                className={`card group p-6 flex items-start gap-6 transition-all duration-300 stagger-${(idx % 8) + 1} ${!n.isRead ? 'bg-primary-50/20 dark:bg-primary-950/20 border-primary-100 dark:border-primary-500/20 shadow-glow-sm' : 'bg-white dark:bg-dark-900'
                                    }`}
                                onMouseEnter={() => !n.isRead && markAsRead(n._id)}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border transition-all duration-500 ${!n.isRead ? 'bg-white dark:bg-dark-900 border-primary-200 dark:border-primary-500/30 scale-105' : 'bg-gray-50 dark:bg-dark-800 border-gray-100 dark:border-gray-700'
                                    }`}>
                                    {getIcon(n.type)}
                                </div>

                                <div className="flex-1 min-w-0 py-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        <h3 className={`text-lg tracking-tight ${!n.isRead ? 'font-black text-gray-900 dark:text-white' : 'font-bold text-gray-600 dark:text-gray-400'}`}>
                                            {n.title}
                                            {!n.isRead && <span className="ml-3 inline-block w-2 h-2 bg-primary-500 rounded-full"></span>}
                                        </h3>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                            {format(new Date(n.createdAt), 'MMM d, HH:mm')}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed mb-5 max-w-3xl">{n.message}</p>

                                    {n.relatedComplaint && (
                                        <Link
                                            to={`/complaints/${n.relatedComplaint._id}`}
                                            className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-4 py-2 rounded-xl border border-transparent hover:border-primary-200 dark:hover:border-primary-500/30 transition-all group/link shadow-sm"
                                        >
                                            Access Protocol {n.relatedComplaint.ticketId}
                                            <HiOutlineArrowNarrowRight className="ml-3 w-4 h-4 group-hover/link:translate-x-1.5 transition-transform" />
                                        </Link>
                                    )}
                                </div>

                                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                                    <button
                                        onClick={() => deleteNotification(n._id)}
                                        className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-dark-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-400 hover:text-rose-500 rounded-2xl transition-all shadow-sm border border-gray-100 dark:border-gray-700"
                                    >
                                        <HiOutlineTrash className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card bg-white dark:bg-dark-900 py-32 flex flex-col items-center justify-center text-center px-6 border-dashed border-2">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-dark-800 rounded-full flex items-center justify-center mb-8 relative">
                            <HiOutlineBell className="w-12 h-12 text-gray-200 dark:text-gray-700" />
                            <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-dark-950"></div>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Signal Silence</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mt-3 font-medium leading-relaxed">
                            System monitoring complete. No active anomalies or status shifts detected in the current cycle.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
