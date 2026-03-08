import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineSearch,
    HiOutlineFilter,
    HiOutlinePlus,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
    HiOutlineCalendar,
    HiOutlineChatAlt,
    HiOutlineTicket,
    HiOutlineAdjustments
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ComplaintList = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pages: 1 });
    const [categories, setCategories] = useState([]);

    // Filters
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState('');
    const [page, setPage] = useState(1);

    const fetchComplaints = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/complaints', {
                params: { search, status, category, priority, page, limit: 10 }
            });
            setComplaints(res.data.complaints);
            setPagination(res.data.pagination);
        } catch (error) {
            console.error('Fetch error', error);
            toast.error('Failed to load records from directory');
        } finally {
            setLoading(false);
        }
    }, [search, status, category, priority, page]);

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories?activeOnly=true');
                setCategories(res.data.categories);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

    const getStatusStyles = (s) => {
        switch (s) {
            case 'resolved': return 'badge-success';
            case 'rejected': return 'badge-danger';
            case 'pending': return 'badge-warning';
            default: return 'badge-primary';
        }
    };

    return (
        <div className="space-y-10 animate-fade-in-up">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Complaint <span className="text-gradient">Directory</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
                        {user?.role === 'student'
                            ? 'Monitor and manage your active grievance protocols.'
                            : 'Orchestrate and resolve inbound academic tickets.'}
                    </p>
                </div>
                {user?.role === 'student' && (
                    <Link to="/complaints/new" className="btn-primary flex items-center shadow-glow">
                        <HiOutlinePlus className="w-5 h-5 mr-2" />
                        Launch New Ticket
                    </Link>
                )}
            </div>

            {/* Filter Hub */}
            <div className="card bg-white dark:bg-dark-900 p-6 flex flex-col xl:flex-row items-center gap-6">
                <div className="w-full xl:flex-1 relative group">
                    <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by ID, title, or protocol context..."
                        className="input-field pl-12 h-12"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <div className="w-full xl:w-auto flex flex-wrap items-center gap-4">
                    <div className="relative min-w-[160px] flex-1">
                        <select
                            className="input-field h-12 text-sm font-bold uppercase tracking-wider"
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                        >
                            <option value="">Status: All</option>
                            <option value="pending">Pending</option>
                            <option value="in-review">In Review</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="relative min-w-[160px] flex-1">
                        <select
                            className="input-field h-12 text-sm font-bold uppercase tracking-wider"
                            value={category}
                            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                        >
                            <option value="">Category: All</option>
                            {categories.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => { setSearch(''); setStatus(''); setCategory(''); setPriority(''); setPage(1); }}
                        className="h-12 px-5 btn-outline flex items-center gap-2 group"
                    >
                        <HiOutlineAdjustments className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Reset</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="space-y-4">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-24 card shimmer"></div>
                        ))}
                    </div>
                ) : complaints.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {complaints.map((c, idx) => (
                            <Link
                                key={c._id}
                                to={`/complaints/${c._id}`}
                                className={`card group p-6 flex flex-col md:flex-row md:items-center gap-6 stagger-${(idx % 8) + 1}`}
                            >
                                <div className="flex items-center gap-6 flex-1">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-dark-800 border border-gray-100 dark:border-gray-700/50 flex items-center justify-center text-2xl group-hover:shadow-glow-sm transition-all duration-300">
                                        {c.category?.icon || '📋'}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <span className="font-mono text-[10px] font-black text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-2.5 py-1 rounded-lg border border-primary-100 dark:border-primary-500/20 tracking-tighter">
                                                {c.ticketId}
                                            </span>
                                            <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${c.priority === 'urgent' ? 'text-rose-500' :
                                                c.priority === 'high' ? 'text-amber-500' : 'text-gray-400'
                                                }`}>
                                                {c.priority}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                                            {c.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2">
                                            <div className="flex items-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                                <HiOutlineCalendar className="w-3.5 h-3.5 mr-2 opacity-50" />
                                                {format(new Date(c.createdAt), 'MMM d, yyyy')}
                                            </div>
                                            <div className="flex items-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                                <div className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: c.category?.color }}></div>
                                                {c.category?.name}
                                            </div>
                                            {c.responses?.length > 0 && (
                                                <div className="flex items-center text-[11px] font-black text-primary-500 uppercase tracking-widest">
                                                    <HiOutlineChatAlt className="w-3.5 h-3.5 mr-2" />
                                                    {c.responses.length} Signals
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:flex-col md:items-end gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50 dark:border-gray-800">
                                    <span className={`badge px-4 py-1.5 uppercase tracking-widest ${getStatusStyles(c.status)}`}>
                                        {c.status.replace('-', ' ')}
                                    </span>
                                    <div className="flex items-center gap-1 text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest group-hover:text-primary-500 transition-colors">
                                        View Protocol <HiOutlineChevronRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="card bg-white dark:bg-dark-900 py-32 flex flex-col items-center justify-center text-center px-6 border-dashed border-2">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-dark-800 rounded-4xl flex items-center justify-center mb-8 animate-bounce-subtle">
                            <HiOutlineTicket className="w-12 h-12 text-gray-200 dark:text-gray-700" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">Directory Empty</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mt-3 font-medium leading-relaxed">
                            No active tickets discovered with current filter signatures. <br />Try resetting parameters.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination Hub */}
            {pagination.pages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between pt-10 gap-6">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        Index <span className="text-gray-900 dark:text-white">{complaints.length}</span> of <span className="text-gray-900 dark:text-white">{pagination.total}</span> Records
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="w-12 h-12 btn-outline p-0 flex items-center justify-center disabled:opacity-20 transition-all"
                        >
                            <HiOutlineChevronLeft className="w-6 h-6" />
                        </button>
                        <div className="h-12 px-6 flex items-center bg-white dark:bg-dark-900 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest shadow-sm">
                            Phase {page} <span className="mx-2 text-gray-300">/</span> {pagination.pages}
                        </div>
                        <button
                            disabled={page === pagination.pages}
                            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                            className="w-12 h-12 btn-outline p-0 flex items-center justify-center disabled:opacity-20 transition-all"
                        >
                            <HiOutlineChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintList;
