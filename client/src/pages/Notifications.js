import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
    HiOutlineBell,
    HiOutlineCheckCircle,
    HiOutlineTrash,
    HiOutlineChatAlt,
    HiOutlineArrowNarrowRight
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
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
            toast.error('Failed to load notifications');
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
            toast.success('All marked as read');
        } catch (err) {
            toast.error('Action failed');
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
            toast.success('Notification deleted');
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'new_response': return <HiOutlineChatAlt className="w-5 h-5 text-blue-500" />;
            case 'complaint_resolved': return <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500" />;
            case 'complaint_submitted': return <HiOutlineBell className="w-5 h-5 text-indigo-500" />;
            default: return <HiOutlineBell className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="bg-primary-600 text-white text-xs px-2.5 py-1 rounded-full">{unreadCount} New</span>
                        )}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Stay updated on your complaints and system activities.</p>
                </div>
                {notifications.length > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="text-primary-600 font-bold text-sm hover:underline flex items-center gap-1"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="divide-y divide-gray-50">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="p-6 animate-pulse flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-2xl"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-1/3 bg-gray-100 rounded"></div>
                                    <div className="h-3 w-2/3 bg-gray-100 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {notifications.map((n) => (
                            <div
                                key={n._id}
                                className={`p-6 flex gap-4 transition-colors relative group ${!n.isRead ? 'bg-primary-50/30' : 'hover:bg-gray-50/50'}`}
                                onMouseEnter={() => !n.isRead && markAsRead(n._id)}
                            >
                                {!n.isRead && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600"></div>
                                )}

                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${!n.isRead ? 'bg-white border-primary-100' : 'bg-gray-50 border-gray-100'
                                    }`}>
                                    {getIcon(n.type)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`text-sm tracking-tight ${!n.isRead ? 'font-bold text-gray-900' : 'font-semibold text-gray-600'}`}>
                                            {n.title}
                                        </h3>
                                        <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap ml-4">
                                            {format(new Date(n.createdAt), 'MMM d, h:mm a')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed mb-3">{n.message}</p>

                                    {n.relatedComplaint && (
                                        <Link
                                            to={`/complaints/${n.relatedComplaint._id}`}
                                            className="inline-flex items-center text-[11px] font-bold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors group/link"
                                        >
                                            View Ticket {n.relatedComplaint.ticketId}
                                            <HiOutlineArrowNarrowRight className="ml-1.5 w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                                        </Link>
                                    )}
                                </div>

                                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => deleteNotification(n._id)}
                                        className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                    >
                                        <HiOutlineTrash className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <HiOutlineBell className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
                        <p className="text-gray-500 max-w-xs mt-1">You don't have any new notifications at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
