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
    HiOutlineChatAlt
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
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
            toast.error('Failed to load complaints');
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

    const getStatusStyle = (s) => {
        switch (s) {
            case 'resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'in-review': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getPriorityStyle = (p) => {
        switch (p) {
            case 'urgent': return 'text-rose-600 font-bold';
            case 'high': return 'text-orange-600 font-bold';
            case 'medium': return 'text-blue-600 font-medium';
            default: return 'text-gray-500 font-medium';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Academic Complaints</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {user?.role === 'student' ? 'View and track your submitted complaints' : 'Manage and resolve student complaints'}
                    </p>
                </div>
                {user?.role === 'student' && (
                    <Link to="/complaints/new" className="btn-primary flex items-center shadow-lg shadow-primary-200">
                        <HiOutlinePlus className="w-5 h-5 mr-2" />
                        Submit Complaint
                    </Link>
                )}
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by ticket ID, title or description..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="bg-gray-50 border-none rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none text-sm font-medium pr-8 appearance-none cursor-pointer"
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="in-review">In Review</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        <select
                            className="bg-gray-50 border-none rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none text-sm font-medium pr-8 appearance-none cursor-pointer"
                            value={category}
                            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>

                        <select
                            className="bg-gray-50 border-none rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none text-sm font-medium pr-8 appearance-none cursor-pointer hidden lg:block"
                            value={priority}
                            onChange={(e) => { setPriority(e.target.value); setPage(1); }}
                        >
                            <option value="">All Priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Complaints List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="divide-y divide-gray-50">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="p-6 animate-pulse flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-1/4 bg-gray-100 rounded"></div>
                                    <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                                </div>
                                <div className="h-8 w-24 bg-gray-100 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                ) : complaints.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {complaints.map((c) => (
                            <Link
                                key={c._id}
                                to={`/complaints/${c._id}`}
                                className="p-6 flex flex-col md:flex-row md:items-center gap-4 hover:bg-gray-50/80 transition-all group"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                                    {c.category?.icon || '📋'}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded tracking-wider">
                                            {c.ticketId}
                                        </span>
                                        <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${getPriorityStyle(c.priority)}`}>
                                            {c.priority}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors truncate">
                                        {c.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-gray-500 font-medium">
                                        <span className="flex items-center">
                                            <HiOutlineCalendar className="w-4 h-4 mr-1.5 text-gray-400" />
                                            {format(new Date(c.createdAt), 'MMM d, yyyy')}
                                        </span>
                                        <span className="flex items-center">
                                            <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: c.category?.color }}></span>
                                            {c.category?.name}
                                        </span>
                                        {c.responses?.length > 0 && (
                                            <span className="flex items-center text-primary-600">
                                                <HiOutlineChatAlt className="w-4 h-4 mr-1.5" />
                                                {c.responses.length} {c.responses.length === 1 ? 'Response' : 'Responses'}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0">
                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border capitalize shadow-sm ${getStatusStyle(c.status)}`}>
                                        {c.status.replace('-', ' ')}
                                    </span>
                                    <div className="md:mt-1">
                                        <HiOutlineChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <HiOutlineSearch className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No complaints found</h3>
                        <p className="text-gray-500 max-w-sm mt-1">
                            We couldn't find any complaints matching your current filters. Try adjusting your search criteria.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-gray-500 font-medium">
                        Showing <span className="text-gray-900">{complaints.length}</span> of <span className="text-gray-900">{pagination.total}</span> complaints
                    </p>
                    <div className="flex items-center space-x-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all"
                        >
                            <HiOutlineChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700">
                            Page {page} of {pagination.pages}
                        </div>
                        <button
                            disabled={page === pagination.pages}
                            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all"
                        >
                            <HiOutlineChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintList;
