import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineChevronLeft,
    HiOutlineClock,
    HiOutlinePaperClip,
    HiOutlineUser,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineChatAlt,
    HiOutlineExternalLink,
    HiOutlineStar,
    HiStar
} from 'react-icons/hi';
import format from 'date-fns/format';
import toast from 'react-hot-toast';

const ComplaintDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState('');
    const [sendingResponse, setSendingResponse] = useState(false);
    const [staffList, setStaffList] = useState([]);

    // Rating state
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    const fetchComplaint = useCallback(async () => {
        try {
            const res = await api.get(`/complaints/${id}`);
            setComplaint(res.data.complaint);
            if (res.data.complaint.satisfaction?.rating) {
                setRating(res.data.complaint.satisfaction.rating);
                setFeedback(res.data.complaint.satisfaction.feedback);
            }
        } catch (err) {
            toast.error('Failed to load complaint details');
            navigate('/complaints');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchComplaint();
    }, [fetchComplaint]);

    useEffect(() => {
        if (user?.role === 'admin') {
            api.get('/users/staff').then(res => setStaffList(res.data.staff));
        }
    }, [user]);

    const handleUpdateStatus = async (status) => {
        let rejectionReason = '';
        if (status === 'rejected') {
            rejectionReason = window.prompt('Please provide a reason for rejection:');
            if (!rejectionReason) return;
        }

        try {
            const res = await api.put(`/complaints/${id}/status`, { status, rejectionReason });
            setComplaint(res.data.complaint);
            toast.success(`Status updated to ${status}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        }
    };

    const handleAssign = async (staffId) => {
        try {
            const res = await api.put(`/complaints/${id}/assign`, { assignedTo: staffId });
            setComplaint(res.data.complaint);
            toast.success('Complaint assigned successfully');
        } catch (err) {
            toast.error('Failed to assign complaint');
        }
    };

    const handleAddResponse = async (e) => {
        e.preventDefault();
        if (!response.trim()) return;

        setSendingResponse(true);
        try {
            const res = await api.post(`/complaints/${id}/respond`, { message: response });
            setComplaint(res.data.complaint);
            setResponse('');
            toast.success('Response added');
        } catch (err) {
            toast.error('Failed to add response');
        } finally {
            setSendingResponse(false);
        }
    };

    const handleSubmitRating = async () => {
        if (rating === 0) return toast.error('Please select a rating');
        try {
            await api.put(`/complaints/${id}/rate`, { rating, feedback });
            toast.success('Thank you for your feedback!');
            fetchComplaint();
        } catch (err) {
            toast.error('Failed to submit rating');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    const getStatusBadge = (s) => {
        switch (s) {
            case 'resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'in-review': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/complaints')}
                    className="flex items-center text-gray-500 hover:text-gray-900 font-medium transition-colors"
                >
                    <HiOutlineChevronLeft className="w-5 h-5 mr-1" />
                    Back to list
                </button>
                <span className="font-mono text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-lg">
                    {complaint.ticketId}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Content */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 md:p-8">
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className={`px-4 py-1 rounded-full text-xs font-bold border shadow-sm ${getStatusBadge(complaint.status)}`}>
                                    {complaint.status.replace('-', ' ')}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black bg-gray-50 border border-gray-100 ${complaint.priority === 'urgent' ? 'text-rose-600' : 'text-gray-500'
                                    }`}>
                                    {complaint.priority} Priority
                                </span>
                                <span className="text-xs text-gray-400 flex items-center ml-auto">
                                    <HiOutlineClock className="w-4 h-4 mr-1" />
                                    Submitted on {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
                                </span>
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{complaint.title}</h1>

                            <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed mb-8">
                                {complaint.description.split('\n').map((para, i) => (
                                    <p key={i} className="mb-4">{para}</p>
                                ))}
                            </div>

                            {complaint.attachments?.length > 0 && (
                                <div className="border-t border-gray-50 pt-6">
                                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                                        <HiOutlinePaperClip className="w-5 h-5 mr-2 text-primary-500" />
                                        Attachments ({complaint.attachments.length})
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {complaint.attachments.map((file, idx) => (
                                            <a
                                                key={idx}
                                                href={`http://localhost:5000/uploads/${file.filename}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all group"
                                            >
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm group-hover:scale-110 transition-transform">
                                                    <HiOutlinePaperClip className="w-5 h-5" />
                                                </div>
                                                <div className="ml-3 truncate">
                                                    <div className="text-xs font-bold text-gray-900 truncate">{file.originalName}</div>
                                                    <div className="text-[10px] text-gray-400 uppercase">{(file.size / 1024).toFixed(0)} KB • Click to view</div>
                                                </div>
                                                <HiOutlineExternalLink className="ml-auto w-4 h-4 text-gray-300" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Conversation/Responses */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center px-4">
                            <HiOutlineChatAlt className="w-5 h-5 mr-2 text-gray-400" />
                            Conversation
                        </h3>

                        <div className="space-y-6">
                            {complaint.responses.map((res, idx) => (
                                <div
                                    key={idx}
                                    className={`flex gap-4 ${res.user?._id === user?._id ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center font-bold text-gray-400">
                                        {res.user?.name?.charAt(0)}
                                    </div>
                                    <div className={`max-w-[80%] space-y-1 ${res.user?._id === user?._id ? 'items-end' : ''}`}>
                                        <div className={`flex items-center gap-2 text-xs font-medium text-gray-500 mb-1 ${res.user?._id === user?._id ? 'justify-end' : ''}`}>
                                            <span className="font-bold text-gray-900">{res.user?.name}</span>
                                            <span>•</span>
                                            <span>{format(new Date(res.createdAt), 'MMM d, h:mm a')}</span>
                                            {res.isInternal && (
                                                <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">Internal</span>
                                            )}
                                        </div>
                                        <div className={`p-4 rounded-2xl ${res.user?._id === user?._id
                                                ? 'bg-primary-600 text-white rounded-tr-none'
                                                : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                                            }`}>
                                            {res.message}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Response Form */}
                            <form onSubmit={handleAddResponse} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mt-8">
                                <textarea
                                    placeholder="Type your response here..."
                                    className="w-full p-4 bg-gray-50/50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                                    rows="3"
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                ></textarea>
                                <div className="flex justify-between items-center mt-3 px-1">
                                    <p className="text-[10px] text-gray-400 font-medium italic">
                                        {user?.role !== 'student' ? 'Responses are visible to the student unless marked Internal.' : 'Staff members will be notified of your reply.'}
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={sendingResponse || !response.trim()}
                                        className="btn-primary py-2 px-6 flex items-center"
                                    >
                                        {sendingResponse ? 'Sending...' : 'Send Reply'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info & Controls */}
                <div className="space-y-6">
                    {/* Status & Assignment Controls (Staff/Admin Only) */}
                    {(user?.role === 'staff' || user?.role === 'admin') && (
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <h3 className="font-bold text-gray-900 flex items-center">
                                Actions
                            </h3>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Update Status</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => handleUpdateStatus('in-progress')}
                                        className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                                    >
                                        <HiOutlineClock className="w-4 h-4" /> Start
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus('resolved')}
                                        className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
                                    >
                                        <HiOutlineCheckCircle className="w-4 h-4" /> Resolve
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleUpdateStatus('rejected')}
                                    className="w-full p-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                                >
                                    <HiOutlineXCircle className="w-4 h-4" /> Reject Complaint
                                </button>
                            </div>

                            {user?.role === 'admin' && (
                                <div className="space-y-3 pt-4 border-t border-gray-50">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Assign Staff</label>
                                    <select
                                        className="input-field py-2 text-sm appearance-none bg-gray-50 border-none"
                                        value={complaint.assignedTo?._id || ''}
                                        onChange={(e) => handleAssign(e.target.value)}
                                    >
                                        <option value="">Choose staff member...</option>
                                        {staffList.map(s => (
                                            <option key={s._id} value={s._id}>{s.name} ({s.department})</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Details Sidebar */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Submitted By</label>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 font-bold text-xl overflow-hidden shadow-sm">
                                    {complaint.submittedBy.avatar ? (
                                        <img src={complaint.submittedBy.avatar} alt="" />
                                    ) : complaint.submittedBy.name?.charAt(0)}
                                </div>
                                <div className="ml-3">
                                    <div className="text-sm font-bold text-gray-900">{complaint.submittedBy.name}</div>
                                    <div className="text-xs text-gray-500">{complaint.submittedBy.department}</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Assigned To</label>
                            <div className="flex items-center">
                                {complaint.assignedTo ? (
                                    <>
                                        <div className="w-12 h-12 bg-secondary-100 rounded-2xl flex items-center justify-center text-secondary-600 font-bold text-xl overflow-hidden shadow-sm">
                                            {complaint.assignedTo.name?.charAt(0)}
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-bold text-gray-900">{complaint.assignedTo.name}</div>
                                            <div className="text-xs text-gray-500">Department Staff</div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-xl border border-amber-100 w-full animate-pulse">
                                        <HiOutlineClock className="w-4 h-4" />
                                        <span className="text-xs font-bold">Awaiting Assignment</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Complaint Details</label>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Category</span>
                                    <span className="font-bold text-gray-900">{complaint.category?.name}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Anonymous</span>
                                    <span className={`font-bold ${complaint.isAnonymous ? 'text-emerald-600' : 'text-gray-900'}`}>{complaint.isAnonymous ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Priority</span>
                                    <span className="font-bold text-gray-900 capitalize">{complaint.priority}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Satisfaction Rating (Student Only, When Resolved) */}
                    {user?.role === 'student' && complaint.status === 'resolved' && (
                        <div className="bg-gradient-to-tr from-primary-600 to-primary-500 p-6 rounded-3xl shadow-xl shadow-primary-200 text-white space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <HiOutlineStar className="w-6 h-6 text-amber-300" />
                                <h3 className="font-bold text-lg">How was the resolution?</h3>
                            </div>

                            {complaint.satisfaction?.rating ? (
                                <div className="space-y-4">
                                    <div className="flex gap-1 justify-center py-2">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <HiStar key={i} className={`w-8 h-8 ${i <= rating ? 'text-amber-300' : 'text-primary-400'}`} />
                                        ))}
                                    </div>
                                    <div className="bg-white/10 p-4 rounded-2xl italic text-sm">
                                        "{feedback || 'No written feedback provided.'}"
                                    </div>
                                    <p className="text-center text-xs opacity-75">Thank you for helping us improve!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm opacity-90 text-center">Your feedback is anonymous and helps us improve our services.</p>
                                    <div className="flex gap-1 justify-center py-2">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <button
                                                key={i}
                                                onMouseEnter={() => setHoverRating(i)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setRating(i)}
                                                className="transition-transform active:scale-90"
                                            >
                                                <HiStar className={`w-10 h-10 transition-colors ${i <= (hoverRating || rating) ? 'text-amber-300' : 'text-primary-400'}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        placeholder="Any additional feedback? (Optional)"
                                        className="w-full p-3 bg-white/20 border-none rounded-2xl placeholder:text-primary-100 focus:ring-2 focus:ring-white outline-none text-white text-sm"
                                        rows="2"
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                    ></textarea>
                                    <button
                                        onClick={handleSubmitRating}
                                        className="w-full bg-white text-primary-600 py-3 rounded-2xl font-bold shadow-lg hover:bg-primary-50 transition-colors"
                                    >
                                        Submit Feedback
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetail;
