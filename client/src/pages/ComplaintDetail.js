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
    HiStar,
    HiOutlineLightningBolt,
    HiOutlineShieldCheck
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
            toast.error('Grievance protocol access denied');
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
            rejectionReason = window.prompt('Protocol Termination Trace: Provide reason for rejection');
            if (!rejectionReason) return;
        }

        try {
            const res = await api.put(`/complaints/${id}/status`, { status, rejectionReason });
            setComplaint(res.data.complaint);
            toast.success(`Protocol state updated to ${status.toUpperCase()}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Status transition failure');
        }
    };

    const handleAssign = async (staffId) => {
        try {
            const res = await api.put(`/complaints/${id}/assign`, { assignedTo: staffId });
            setComplaint(res.data.complaint);
            toast.success('Agent assigned to protocol');
        } catch (err) {
            toast.error('Agent assignment failure');
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
            toast.success('Signal transmitted successfully');
        } catch (err) {
            toast.error('Signal transmission failure');
        } finally {
            setSendingResponse(false);
        }
    };

    const handleSubmitRating = async () => {
        if (rating === 0) return toast.error('Feedback rating required');
        try {
            await api.put(`/complaints/${id}/rate`, { rating, feedback });
            toast.success('Efficiency data recorded. Thank you.');
            fetchComplaint();
        } catch (err) {
            toast.error('Feedback recording failure');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary-100 dark:border-primary-950/40 border-t-primary-600 rounded-full animate-spin"></div>
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">Decrypting Protocol Data...</span>
            </div>
        );
    }

    const getStatusStyle = (s) => {
        switch (s) {
            case 'resolved': return 'badge-success';
            case 'rejected': return 'badge-danger';
            case 'pending': return 'badge-warning';
            default: return 'badge-primary';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
            {/* Header / Nav */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/complaints')}
                    className="group flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white dark:hover:bg-dark-900 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
                >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-dark-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <HiOutlineChevronLeft className="w-5 h-5 text-gray-500" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Directory Return</span>
                </button>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Packet Hash</span>
                    <span className="font-mono text-xs font-black text-primary-500 bg-primary-50 dark:bg-primary-950/40 px-3 py-1.5 rounded-lg border border-primary-100 dark:border-primary-500/20">
                        {complaint.ticketId}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Grievance Core Document */}
                    <div className="card bg-white dark:bg-dark-900 overflow-hidden">
                        <div className="h-1.5 w-full bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500"></div>
                        <div className="p-8 md:p-10 space-y-8">
                            <div className="flex flex-wrap items-center gap-4">
                                <span className={`badge px-5 py-2 uppercase tracking-widest text-[10px] ${getStatusStyle(complaint.status)}`}>
                                    {complaint.status.replace('-', ' ')}
                                </span>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${complaint.priority === 'urgent'
                                        ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:border-rose-500/20'
                                        : 'bg-gray-50 text-gray-500 border-gray-100 dark:bg-dark-800 dark:border-gray-700'
                                    }`}>
                                    <HiOutlineLightningBolt className="w-3.5 h-3.5" />
                                    {complaint.priority} Priority
                                </div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center ml-auto">
                                    <HiOutlineClock className="w-4 h-4 mr-2 opacity-50" />
                                    Timestamp: {format(new Date(complaint.createdAt), 'MMM d, yyyy • HH:mm')}
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                                {complaint.title}
                            </h1>

                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                {complaint.description.split('\n').map((para, i) => (
                                    <p key={i} className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-4">
                                        {para}
                                    </p>
                                ))}
                            </div>

                            {complaint.attachments?.length > 0 && (
                                <div className="pt-8 border-t border-gray-50 dark:border-gray-800">
                                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-3">
                                        <HiOutlinePaperClip className="w-4 h-4 text-primary-500" />
                                        Evidence Payloads ({complaint.attachments.length})
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {complaint.attachments.map((file, idx) => (
                                            <a
                                                key={idx}
                                                href={`http://localhost:5000/uploads/${file.filename}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-center p-4 bg-gray-50 dark:bg-dark-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-primary-500 transition-all"
                                            >
                                                <div className="w-12 h-12 bg-white dark:bg-dark-800 rounded-xl flex items-center justify-center text-primary-500 shadow-sm group-hover:shadow-glow-sm transition-all">
                                                    <HiOutlineExternalLink className="w-6 h-6" />
                                                </div>
                                                <div className="ml-4 truncate">
                                                    <div className="text-sm font-black text-gray-900 dark:text-white truncate">{file.originalName}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{(file.size / 1024).toFixed(0)} KB • View Payload</div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Signal Intelligence (Responses) */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] flex items-center">
                                <HiOutlineChatAlt className="w-4 h-4 mr-3 text-secondary-500" />
                                Signal Intelligence
                            </h3>
                            <span className="text-[10px] font-bold text-gray-400 px-3 py-1 rounded-full bg-gray-100 dark:bg-dark-800">
                                {complaint.responses.length} Transmissions
                            </span>
                        </div>

                        <div className="space-y-8">
                            {complaint.responses.map((res, idx) => {
                                const isSelf = res.user?._id === user?._id;
                                return (
                                    <div
                                        key={idx}
                                        className={`flex gap-4 ${isSelf ? 'flex-row-reverse' : ''}`}
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-dark-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center font-black text-gray-400 shadow-sm shrink-0">
                                            {res.user?.name?.charAt(0)}
                                        </div>
                                        <div className={`max-w-[85%] space-y-2 ${isSelf ? 'items-end' : ''}`}>
                                            <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400 ${isSelf ? 'justify-end' : ''}`}>
                                                <span className="text-gray-900 dark:text-white">{res.user?.name}</span>
                                                <span className="opacity-30">•</span>
                                                <span>{format(new Date(res.createdAt), 'MMM d, h:mm a')}</span>
                                                {res.isInternal && (
                                                    <span className="badge-warning text-[9px] px-2 py-0.5 rounded-lg border border-warning-200">Classified</span>
                                                )}
                                            </div>
                                            <div className={`p-5 rounded-2xl text-[15px] leading-relaxed relative ${isSelf
                                                    ? 'bg-primary-600 text-white rounded-tr-none shadow-glow-sm'
                                                    : 'bg-white dark:bg-dark-900 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-300 rounded-tl-none shadow-sm'
                                                }`}>
                                                {res.message}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Response Terminal */}
                            <form onSubmit={handleAddResponse} className="card bg-white dark:bg-dark-900 p-6 space-y-4 border-dashed">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">New Signal Capture</label>
                                <textarea
                                    placeholder="Enter encrypted response..."
                                    className="input-field min-h-[120px] p-5 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-dark-800/30 border-none transition-all resize-none"
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                ></textarea>
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                                    <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-dark-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                        <HiOutlineShieldCheck className="w-4 h-4 text-emerald-500" />
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                                            {user?.role !== 'student'
                                                ? 'Public Protocol Transmission'
                                                : 'Secure Staff Channel Active'}
                                        </p>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={sendingResponse || !response.trim()}
                                        className="btn-primary py-3 px-10 shadow-glow disabled:opacity-30"
                                    >
                                        {sendingResponse ? 'Transmitting...' : 'Transmit Signal'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sidebar Protocol Summary */}
                <div className="space-y-8">
                    {/* Action Matrix (Admin/Staff) */}
                    {(user?.role === 'staff' || user?.role === 'admin') && (
                        <div className="card bg-white dark:bg-dark-900 p-8 space-y-8">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Phase Control</h3>
                            <div className="space-y-4">
                                <button
                                    onClick={() => handleUpdateStatus('in-progress')}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 font-black text-[11px] uppercase tracking-widest hover:bg-blue-100 transition-all"
                                >
                                    Initialize Phase 2: In Progress <HiOutlineClock className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('resolved')}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black text-[11px] uppercase tracking-widest hover:bg-emerald-100 transition-all"
                                >
                                    Execute Target State: Resolved <HiOutlineCheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('rejected')}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 font-black text-[11px] uppercase tracking-widest hover:bg-rose-100 transition-all opacity-70 hover:opacity-100"
                                >
                                    Terminate Protocol: Reject <HiOutlineXCircle className="w-5 h-5" />
                                </button>
                            </div>

                            {user?.role === 'admin' && (
                                <div className="space-y-4 pt-6 border-t border-gray-50 dark:border-gray-800">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Asset Allocation</label>
                                    <select
                                        className="input-field py-3 text-xs font-bold uppercase tracking-widest appearance-none"
                                        value={complaint.assignedTo?._id || ''}
                                        onChange={(e) => handleAssign(e.target.value)}
                                    >
                                        <option value="">Awaiting Asset Selection</option>
                                        {staffList.map(s => (
                                            <option key={s._id} value={s._id}>{s.name} • {s.department}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Protocol Meta Matrix */}
                    <div className="card bg-white dark:bg-dark-900 p-8 space-y-10">
                        <section className="space-y-5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Origin Identity</label>
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-primary-50 dark:bg-primary-950/40 rounded-2xl flex items-center justify-center text-primary-500 font-black text-2xl border border-primary-100 dark:border-primary-500/20 shadow-sm">
                                    {complaint.submittedBy.name?.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-sm font-black text-gray-900 dark:text-white tracking-tight">{complaint.submittedBy.name}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{complaint.submittedBy.department} Entity</div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Assigned Operative</label>
                            <div className="flex items-center gap-5">
                                {complaint.assignedTo ? (
                                    <>
                                        <div className="w-14 h-14 bg-secondary-50 dark:bg-secondary-950/40 rounded-2xl flex items-center justify-center text-secondary-500 font-black text-2xl border border-secondary-100 dark:border-secondary-500/20 shadow-sm">
                                            {complaint.assignedTo.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-gray-900 dark:text-white tracking-tight">{complaint.assignedTo.name}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Specialist Operative</div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-4 text-amber-500 bg-amber-50/50 dark:bg-amber-950/20 px-4 py-4 rounded-2xl border border-amber-100 dark:border-amber-500/20 w-full animate-pulse-slow">
                                        <HiOutlineClock className="w-6 h-6 shrink-0" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Operative Assignment</span>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="space-y-4 pt-6 border-t border-gray-50 dark:border-gray-800">
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Sector</span>
                                <span className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest px-3 py-1 bg-gray-50 dark:bg-dark-800 rounded-lg">{complaint.category?.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Mode</span>
                                <span className={`text-[11px] font-black uppercase tracking-widest ${complaint.isAnonymous ? 'text-emerald-500' : 'text-gray-900 dark:text-white'}`}>
                                    {complaint.isAnonymous ? 'STEALTH ACTIVE' : 'OPEN COMMS'}
                                </span>
                            </div>
                        </section>
                    </div>

                    {/* Efficiency Audit (Rating) */}
                    {user?.role === 'student' && complaint.status === 'resolved' && (
                        <div className="relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-900 animate-gradient-shift"></div>
                            <div className="relative z-10 p-8 space-y-6 text-white">
                                <div className="flex items-center gap-3">
                                    <HiOutlineStar className="w-6 h-6 text-amber-300" />
                                    <h3 className="font-black text-xs uppercase tracking-[0.2em]">Efficiency Audit</h3>
                                </div>

                                {complaint.satisfaction?.rating ? (
                                    <div className="space-y-6">
                                        <div className="flex gap-2 justify-center">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <HiStar key={i} className={`w-8 h-8 ${i <= rating ? 'text-amber-300' : 'text-white/20'}`} />
                                            ))}
                                        </div>
                                        <div className="bg-black/20 p-5 rounded-2xl border border-white/10 italic text-sm font-medium leading-relaxed">
                                            "{feedback || 'No qualitative data provided.'}"
                                        </div>
                                        <p className="text-center text-[10px] font-black uppercase tracking-widest opacity-60">Audit Complete • Protocol Closed</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <p className="text-xs font-medium opacity-80 text-center leading-relaxed">Please rate the efficiency of the resolution protocol.</p>
                                        <div className="flex gap-2 justify-center">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <button
                                                    key={i}
                                                    onMouseEnter={() => setHoverRating(i)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setRating(i)}
                                                    className="transition-transform active:scale-95"
                                                >
                                                    <HiStar className={`w-10 h-10 transition-all duration-300 ${i <= (hoverRating || rating) ? 'text-amber-300 scale-110' : 'text-white/20'}`} />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            placeholder="Audit comments (Optional)..."
                                            className="w-full p-4 bg-white/10 border border-white/10 rounded-2xl placeholder:text-white/30 focus:ring-2 focus:ring-white/50 outline-none text-white text-sm"
                                            rows="3"
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                        ></textarea>
                                        <button
                                            onClick={handleSubmitRating}
                                            className="w-full bg-white text-primary-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            Record Audit Data
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetail;
