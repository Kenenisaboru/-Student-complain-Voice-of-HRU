import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
    HiOutlineClipboardList,
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlinePlus,
    HiOutlineArrowRight
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie
} from 'recharts';
import format from 'date-fns/format';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                setStats(res.data.stats);
            } catch (error) {
                console.error('Failed to fetch stats', error);
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-12 w-64 bg-gray-200 rounded-lg"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-96 bg-gray-200 rounded-2xl"></div>
                    <div className="h-96 bg-gray-200 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Total Complaints',
            value: stats?.totalComplaints || 0,
            icon: HiOutlineClipboardList,
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            label: 'Pending',
            value: stats?.statusCounts?.pending || 0,
            icon: HiOutlineClock,
            color: 'bg-amber-500',
            textColor: 'text-amber-600',
            bgColor: 'bg-amber-50'
        },
        {
            label: 'Resolved',
            value: stats?.statusCounts?.resolved || 0,
            icon: HiOutlineCheckCircle,
            color: 'bg-emerald-500',
            textColor: 'text-emerald-600',
            bgColor: 'bg-emerald-50'
        },
        {
            label: 'Rejected',
            value: stats?.statusCounts?.rejected || 0,
            icon: HiOutlineXCircle,
            color: 'bg-rose-500',
            textColor: 'text-rose-600',
            bgColor: 'bg-rose-50'
        },
    ];

    // Data for Charts
    const statusData = [
        { name: 'Pending', value: stats?.statusCounts?.pending || 0, color: '#f59e0b' },
        { name: 'In Review', value: stats?.statusCounts?.['in-review'] || 0, color: '#3b82f6' },
        { name: 'In Progress', value: stats?.statusCounts?.['in-progress'] || 0, color: '#8b5cf6' },
        { name: 'Resolved', value: stats?.statusCounts?.resolved || 0, color: '#10b981' },
        { name: 'Rejected', value: stats?.statusCounts?.rejected || 0, color: '#ef4444' },
    ].filter(d => d.value > 0);

    const priorityData = [
        { name: 'Low', value: stats?.priorityCounts?.low || 0, color: '#94a3b8' },
        { name: 'Medium', value: stats?.priorityCounts?.medium || 0, color: '#3b82f6' },
        { name: 'High', value: stats?.priorityCounts?.high || 0, color: '#f97316' },
        { name: 'Urgent', value: stats?.priorityCounts?.urgent || 0, color: '#ef4444' },
    ].filter(d => d.value > 0);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {user?.name}. Here's what's happening today.</p>
                </div>
                {user?.role === 'student' && (
                    <Link to="/complaints/new" className="btn-primary flex items-center shadow-lg shadow-primary-200">
                        <HiOutlinePlus className="w-5 h-5 mr-2" />
                        New Complaint
                    </Link>
                )}
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.textColor}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-2xl font-bold text-gray-900`}>{stat.value}</span>
                        </div>
                        <div className="mt-4">
                            <span className="text-gray-500 font-medium">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Status Distribution */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-2 h-6 bg-primary-600 rounded-full mr-3"></span>
                        Status Distribution
                    </h3>
                    <div className="h-80 w-full">
                        {statusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={statusData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', shadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <HiOutlineClipboardList className="w-12 h-12 mb-2 opacity-20" />
                                <p>No status data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Priority Breakdown */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-2 h-6 bg-secondary-600 rounded-full mr-3"></span>
                        Priority Breakdown
                    </h3>
                    <div className="h-80 w-full">
                        {priorityData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={priorityData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {priorityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', shadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <HiOutlineClipboardList className="w-12 h-12 mb-2 opacity-20" />
                                <p>No priority data available</p>
                            </div>
                        )}
                        <div className="flex justify-center gap-4 mt-2">
                            {priorityData.map((d, i) => (
                                <div key={i} className="flex items-center text-xs text-gray-500">
                                    <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: d.color }}></span>
                                    {d.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Complaints */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Recent Complaints</h3>
                    <Link to="/complaints" className="text-primary-600 font-semibold text-sm hover:underline inline-flex items-center">
                        View All <HiOutlineArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Ticket ID</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Priority</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stats?.recentComplaints?.length > 0 ? (
                                stats.recentComplaints.map((complaint) => (
                                    <tr key={complaint._id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                                {complaint.ticketId}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <Link to={`/complaints/${complaint._id}`} className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                                    {complaint.title}
                                                </Link>
                                                <span className="text-xs text-gray-400 flex items-center mt-1">
                                                    <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: complaint.category?.color }}></span>
                                                    {complaint.category?.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize ${complaint.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                                                    complaint.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        complaint.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                                                            'bg-blue-100 text-blue-700'
                                                }`}>
                                                {complaint.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black ${complaint.priority === 'high' || complaint.priority === 'urgent' ? 'text-rose-600' : 'text-gray-400'
                                                }`}>
                                                {complaint.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                        No complaints found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
