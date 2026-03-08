import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
    HiOutlineClipboardList,
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlinePlus,
    HiOutlineArrowRight,
    HiOutlineTrendingUp,
    HiOutlineLightningBolt
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    AreaChart, Area
} from 'recharts';
import { format } from 'date-fns';
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
                <div className="h-12 w-64 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-[400px] bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>
                    <div className="h-[400px] bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Active Tickets',
            value: stats?.totalComplaints || 0,
            icon: HiOutlineClipboardList,
            gradient: 'from-primary-600 to-primary-400',
            bg: 'bg-primary-50 dark:bg-primary-500/10',
            text: 'text-primary-600 dark:text-primary-400'
        },
        {
            label: 'Pending Review',
            value: stats?.statusCounts?.pending || 0,
            icon: HiOutlineClock,
            gradient: 'from-amber-500 to-amber-300',
            bg: 'bg-amber-50 dark:bg-amber-500/10',
            text: 'text-amber-600 dark:text-amber-400'
        },
        {
            label: 'Successfully Resolved',
            value: stats?.statusCounts?.resolved || 0,
            icon: HiOutlineCheckCircle,
            gradient: 'from-emerald-500 to-emerald-300',
            bg: 'bg-emerald-50 dark:bg-emerald-500/10',
            text: 'text-emerald-600 dark:text-emerald-400'
        },
        {
            label: 'System Rejections',
            value: stats?.statusCounts?.rejected || 0,
            icon: HiOutlineXCircle,
            gradient: 'from-rose-500 to-rose-300',
            bg: 'bg-rose-50 dark:bg-rose-500/10',
            text: 'text-rose-600 dark:text-rose-400'
        },
    ];

    const statusData = [
        { name: 'Pending', value: stats?.statusCounts?.pending || 0, color: '#f59e0b' },
        { name: 'In Review', value: stats?.statusCounts?.['in-review'] || 0, color: '#3b82f6' },
        { name: 'In Progress', value: stats?.statusCounts?.['in-progress'] || 0, color: '#8b5cf6' },
        { name: 'Resolved', value: stats?.statusCounts?.resolved || 0, color: '#10b981' },
    ].filter(d => d.value > 0);

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Operational <span className="text-gradient">Intelligence</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
                        Welcome back, <span className="text-gray-900 dark:text-white font-bold">{user?.name}</span>. The system is operating normally.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-outline hidden sm:flex items-center">
                        <HiOutlineTrendingUp className="w-5 h-5 mr-2" />
                        Generate Report
                    </button>
                    {user?.role === 'student' && (
                        <Link to="/complaints/new" className="btn-primary flex items-center shadow-glow">
                            <HiOutlinePlus className="w-5 h-5 mr-2" />
                            Launch New Ticket
                        </Link>
                    )}
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className={`stat-card stagger-${idx + 1}`}>
                        <div className="flex items-center justify-between relative z-10">
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.text} flex items-center justify-center`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-gray-900 dark:text-white leading-none">
                                    {stat.value}
                                </div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Growth +12%</div>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between relative z-10">
                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{stat.label}</span>
                            <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className={`h-full bg-gradient-to-r ${stat.gradient}`} style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Visual Analytics */}
                <div className="xl:col-span-2 card bg-white dark:bg-dark-900 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Ticket Flow Analytics</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time status tracking</p>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-50 dark:bg-dark-800 p-1 rounded-xl">
                            <button className="px-3 py-1.5 text-[10px] font-black uppercase bg-white dark:bg-dark-700 shadow-sm rounded-lg text-gray-900 dark:text-white transition-all">Today</button>
                            <button className="px-3 py-1.5 text-[10px] font-black uppercase text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all">Week</button>
                        </div>
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statusData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" opacity={0.1} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                                    dy={10}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        backgroundColor: '#1e293b',
                                        color: '#fff',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)'
                                    }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={45}>
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Efficiency Card */}
                <div className="card bg-gradient-to-br from-primary-600 to-secondary-700 p-8 text-white flex flex-col justify-between overflow-hidden relative group">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                            <HiOutlineLightningBolt className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-black leading-tight">Response <br />Performance</h3>
                        <p className="text-primary-100 text-sm mt-3 opacity-80 leading-relaxed font-medium">Your average response time has improved by <br /><span className="text-white font-black">1.2 hours</span> this week.</p>
                    </div>
                    <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
                        <div className="flex justify-between items-end">
                            <div>
                                <div className="text-3xl font-black">94%</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">SLA Success Rate</div>
                            </div>
                            <Link to="/analytics" className="w-10 h-10 bg-white text-primary-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                                <HiOutlineArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activities Table */}
            <div className="card bg-white dark:bg-dark-900 overflow-hidden">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-dark-900">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">Recent Transactions</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Live complaint activity feed</p>
                    </div>
                    <Link to="/complaints" className="btn-ghost text-xs uppercase font-black tracking-widest flex items-center">
                        View All <HiOutlineArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>
                {/* Desktop View: Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-dark-800/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <th className="px-8 py-5">Descriptor</th>
                                <th className="px-8 py-5">Title & Protocol Context</th>
                                <th className="px-8 py-5 text-center">Status</th>
                                <th className="px-8 py-5 text-center">Urgency</th>
                                <th className="px-8 py-5 text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {stats?.recentComplaints?.length > 0 ? (
                                stats.recentComplaints.map((complaint, idx) => (
                                    <tr key={complaint._id} className="hover:bg-gray-50/50 dark:hover:bg-dark-800/30 transition-all group">
                                        <td className="px-8 py-5">
                                            <span className="font-mono text-[10px] font-black text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-2 py-1.5 rounded-lg border border-primary-100 dark:border-primary-500/20 tracking-tighter shadow-sm">
                                                {complaint.ticketId}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <Link to={`/complaints/${complaint._id}`} className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">
                                                    {complaint.title}
                                                </Link>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: complaint.category?.color }}></span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{complaint.category?.name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`badge ${complaint.status === 'resolved' ? 'badge-success' :
                                                complaint.status === 'pending' ? 'badge-warning' :
                                                    complaint.status === 'rejected' ? 'badge-danger' :
                                                        'badge-primary'
                                                }`}>
                                                {complaint.status.replace('-', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${complaint.priority === 'urgent' ? 'text-rose-500' :
                                                complaint.priority === 'high' ? 'text-amber-500' : 'text-gray-400'
                                                }`}>
                                                {complaint.priority}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right text-[11px] font-bold text-gray-500 dark:text-gray-400">
                                            {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-gray-400 italic font-medium">
                                        No active records discovered in the directory.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View: Cards */}
                <div className="md:hidden divide-y divide-gray-50 dark:divide-gray-800">
                    {stats?.recentComplaints?.length > 0 ? (
                        stats.recentComplaints.map((complaint) => (
                            <Link
                                key={complaint._id}
                                to={`/complaints/${complaint._id}`}
                                className="flex flex-col p-6 space-y-4 hover:bg-gray-50/50 dark:hover:bg-dark-800/30 transition-all"
                            >
                                <div className="flex justify-between items-start">
                                    <span className="font-mono text-[9px] font-black text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-2 py-1 rounded-lg border border-primary-100 dark:border-primary-500/20 tracking-tighter uppercase">
                                        {complaint.ticketId}
                                    </span>
                                    <span className={`badge text-[9px] ${complaint.status === 'resolved' ? 'badge-success' :
                                        complaint.status === 'pending' ? 'badge-warning' :
                                            'badge-primary'
                                        }`}>
                                        {complaint.status.replace('-', ' ')}
                                    </span>
                                </div>
                                <h4 className="font-black text-gray-900 dark:text-white leading-tight">{complaint.title}</h4>
                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
                                    </span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${complaint.priority === 'urgent' ? 'text-rose-500' : 'text-gray-400'}`}>
                                        {complaint.priority}
                                    </span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="p-10 text-center text-gray-400 italic text-sm">No recent signals detected.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

