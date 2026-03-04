import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    HiOutlineChevronLeft,
    HiOutlineInformationCircle,
    HiOutlinePaperClip,
    HiOutlineX,
    HiOutlineCheckCircle,
    HiOutlinePaperAirplane,
    HiOutlineShieldCheck
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const ComplaintCreate = () => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        priority: 'medium',
        description: '',
        isAnonymous: false
    });
    const [files, setFiles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [catLoading, setCatLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories?activeOnly=true');
                setCategories(res.data.categories);
                if (res.data.categories.length > 0) {
                    setFormData(prev => ({ ...prev, category: res.data.categories[0]._id }));
                }
            } catch (err) {
                toast.error('Sector data retrieval failure');
            } finally {
                setCatLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (files.length + selectedFiles.length > 3) {
            return toast.error('Protocol Limit: Maximum 3 attachments allowed');
        }
        const filteredFiles = selectedFiles.filter(file => file.size <= 5 * 1024 * 1024);
        if (filteredFiles.length < selectedFiles.length) {
            toast.error('Payload overflow: Some files exceed 5MB limit');
        }
        setFiles([...files, ...filteredFiles]);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description || !formData.category) {
            return toast.error('Incomplete Manifest: Required fields missing');
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('priority', formData.priority);
        data.append('description', formData.description);
        data.append('isAnonymous', formData.isAnonymous);

        files.forEach(file => {
            data.append('attachments', file);
        });

        setLoading(true);
        try {
            await api.post('/complaints', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Protocol Initialized: Complaint Synchronized');
            navigate('/complaints');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Protocol transmission failure');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
            {/* Header / Nav */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white dark:hover:bg-dark-900 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
                >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-dark-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <HiOutlineChevronLeft className="w-5 h-5 text-gray-500" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Abort Mission</span>
                </button>
                <div className="hidden sm:flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure Protocol</span>
                    <HiOutlineShieldCheck className="w-5 h-5 text-emerald-500" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <div className="card bg-white dark:bg-dark-900 overflow-hidden shadow-glow-sm">
                        <div className="h-1.5 w-full bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 animate-gradient-shift"></div>
                        <div className="p-8 md:p-10">
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-3">Initialize <span className="text-gradient">Grievance Protocol</span></h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-10">Construct your ticket with precision. Verified details accelerate resolution efficiency.</p>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-6">
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Protocol Handle (Title)</label>
                                        <input
                                            name="title"
                                            required
                                            placeholder="Specify core issue concisely..."
                                            className="input-field h-14 text-lg"
                                            value={formData.title}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Category */}
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Academic Sector</label>
                                            <div className="relative">
                                                {catLoading ? (
                                                    <div className="h-14 bg-gray-50 dark:bg-dark-800 animate-pulse rounded-2xl"></div>
                                                ) : (
                                                    <select
                                                        name="category"
                                                        required
                                                        className="input-field h-14 appearance-none font-bold text-sm tracking-wide"
                                                        value={formData.category}
                                                        onChange={handleChange}
                                                    >
                                                        {categories.map(c => (
                                                            <option key={c._id} value={c._id}>{c.name}</option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        </div>

                                        {/* Priority */}
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Impact Signature</label>
                                            <select
                                                name="priority"
                                                className="input-field h-14 appearance-none font-bold text-sm tracking-wide"
                                                value={formData.priority}
                                                onChange={handleChange}
                                            >
                                                <option value="low">Low Impact (Suggestion)</option>
                                                <option value="medium">Medium Impact (Standard)</option>
                                                <option value="high">High Impact (Serious)</option>
                                                <option value="urgent">Urgent Response Required</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Event Detailed Manifest</label>
                                        <textarea
                                            name="description"
                                            required
                                            rows="8"
                                            placeholder="Provide technical details, course indices, faculty involvement, and exact timeline of the issue..."
                                            className="input-field p-6 text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-dark-800/30 border-none transition-all resize-none leading-relaxed"
                                            value={formData.description}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>

                                    {/* Attachments */}
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Evidence Payload</label>
                                        <div className="mt-2 flex flex-col space-y-4">
                                            <label className="flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl py-12 px-6 hover:bg-gray-50 dark:hover:bg-dark-800 hover:border-primary-500 transition-all cursor-pointer group relative overflow-hidden">
                                                <div className="text-center relative z-10">
                                                    <HiOutlinePaperClip className="mx-auto h-10 w-10 text-gray-300 group-hover:text-primary-500 group-hover:scale-110 transition-all" />
                                                    <span className="mt-4 block text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Aggregate Files</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 opacity-60">PDF, JPG, PNG • Max 5MB / Terminal</span>
                                                </div>
                                                <input
                                                    type="file"
                                                    multiple
                                                    className="hidden"
                                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                    onChange={handleFileChange}
                                                />
                                            </label>

                                            {files.length > 0 && (
                                                <div className="grid grid-cols-1 gap-3">
                                                    {files.map((file, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-dark-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm animate-fade-in-up"
                                                            style={{ animationDelay: `${idx * 0.1}s` }}>
                                                            <div className="flex items-center truncate">
                                                                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-950/40 rounded-xl flex items-center justify-center text-primary-500 mr-4">
                                                                    <HiOutlinePaperClip className="w-5 h-5" />
                                                                </div>
                                                                <div className="truncate">
                                                                    <div className="text-xs font-black text-gray-900 dark:text-white truncate uppercase tracking-tighter">{file.name}</div>
                                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-60">Payload Size: {(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFile(idx)}
                                                                className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-dark-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-400 hover:text-rose-500 rounded-xl transition-all"
                                                            >
                                                                <HiOutlineX className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Anonymous Option */}
                                    <div className="pt-6 border-t border-gray-50 dark:border-gray-800">
                                        <div className="flex items-center px-6 py-5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-3xl border border-indigo-100 dark:border-indigo-500/20 group hover:border-indigo-500 transition-all cursor-pointer">
                                            <div className="relative flex items-center h-6">
                                                <input
                                                    id="isAnonymous"
                                                    name="isAnonymous"
                                                    type="checkbox"
                                                    className="w-6 h-6 text-indigo-600 border-gray-300 rounded-lg focus:ring-indigo-500 bg-white dark:bg-dark-800"
                                                    checked={formData.isAnonymous}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <label htmlFor="isAnonymous" className="ml-5 flex-1 cursor-pointer">
                                                <span className="block text-sm font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest">Activate Stealth Mode</span>
                                                <span className="block text-[10px] font-bold text-indigo-700/60 dark:text-indigo-400/60 uppercase tracking-widest mt-1">Initialize identity encapsulation. Only protocol data will be visible to adjudicators.</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex pt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary w-full py-5 shadow-glow flex items-center justify-center gap-3 text-lg"
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <HiOutlinePaperAirplane className="w-6 h-6 rotate-45" />
                                                Transmit Protocol Load
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sidebar Guideline Hub */}
                <div className="space-y-8">
                    <div className="relative overflow-hidden card group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-900 group-hover:scale-105 transition-transform duration-700"></div>
                        <div className="relative z-10 p-8 space-y-6 text-white">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                                    <HiOutlineInformationCircle className="w-6 h-6" />
                                </div>
                                <h3 className="font-black text-xs uppercase tracking-[0.3em]">Directives</h3>
                            </div>
                            <ul className="space-y-5">
                                {[
                                    'Specify exact course indices.',
                                    'Verify faculty identity parameters.',
                                    'Encrypt attachments for security.',
                                    'Monitor terminal for status signals.',
                                    'SLA Response: 72-120 Hours.'
                                ].map((step, i) => (
                                    <li key={i} className="flex gap-4 items-start text-[11px] font-bold uppercase tracking-widest opacity-80 leading-relaxed">
                                        <span className="w-1.5 h-1.5 bg-primary-300 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="card bg-white dark:bg-dark-900 p-8 space-y-8">
                        <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] flex items-center gap-3">
                            <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500" />
                            Lifecycle Status
                        </h3>
                        <div className="relative space-y-10">
                            {[
                                { label: 'Transmission', desc: 'Current active phase', active: true },
                                { label: 'Triage', desc: 'Sector specialist assignment', active: false },
                                { label: 'Investigation', desc: 'Protocol audit & verification', active: false },
                                { label: 'Execution', desc: 'Resolution & identity close', active: false }
                            ].map((step, i) => (
                                <div key={i} className="relative pl-10">
                                    {i < 3 && (
                                        <div className={`absolute left-[13px] top-8 bottom-[-24px] w-[2px] ${step.active ? 'bg-primary-500' : 'bg-gray-100 dark:bg-dark-800'}`}></div>
                                    )}
                                    <div className={`absolute left-0 top-1 w-7 h-7 rounded-lg flex items-center justify-center border-2 transition-all duration-500 ${step.active
                                        ? 'bg-primary-500 border-primary-500 shadow-glow-sm text-white'
                                        : 'bg-white dark:bg-dark-950 border-gray-100 dark:border-gray-800 text-gray-300'
                                        }`}>
                                        <span className="text-[10px] font-black">{i + 1}</span>
                                    </div>
                                    <div className={`text-xs font-black uppercase tracking-widest ${step.active ? 'text-gray-900 dark:text-white' : 'text-gray-300 dark:text-gray-600'}`}>{step.label}</div>
                                    <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1 opacity-70">{step.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintCreate;
