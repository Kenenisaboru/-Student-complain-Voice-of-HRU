import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    HiOutlineChevronLeft,
    HiOutlineInformationCircle,
    HiOutlinePaperClip,
    HiOutlineX,
    HiOutlineCheckCircle
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
                toast.error('Failed to load categories');
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
            return toast.error('Maximum 3 files allowed');
        }
        const filteredFiles = selectedFiles.filter(file => file.size <= 5 * 1024 * 1024);
        if (filteredFiles.length < selectedFiles.length) {
            toast.error('Some files exceed 5MB limit');
        }
        setFiles([...files, ...filteredFiles]);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description || !formData.category) {
            return toast.error('Please fill in all required fields');
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
            toast.success('Complaint submitted successfully!');
            navigate('/complaints');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to submit complaint');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-500 hover:text-gray-900 font-medium mb-6 transition-colors"
            >
                <HiOutlineChevronLeft className="w-5 h-5 mr-1" />
                Back
            </button>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-6">
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit New Complaint</h1>
                        <p className="text-gray-500 text-sm mb-8">Please provide as much detail as possible to help us resolve your issue effectively.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Complaint Title <span className="text-red-500">*</span></label>
                                    <input
                                        name="title"
                                        required
                                        placeholder="e.g., Missing grade in Software Engineering II"
                                        className="input-field"
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            {catLoading ? (
                                                <div className="h-10 bg-gray-50 animate-pulse rounded-lg"></div>
                                            ) : (
                                                <select
                                                    name="category"
                                                    required
                                                    className="input-field appearance-none"
                                                    value={formData.category}
                                                    onChange={handleChange}
                                                >
                                                    {categories.map(c => (
                                                        <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    </div>

                                    {/* Priority */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Priority Level</label>
                                        <select
                                            name="priority"
                                            className="input-field appearance-none"
                                            value={formData.priority}
                                            onChange={handleChange}
                                        >
                                            <option value="low">Low - General Suggestion</option>
                                            <option value="medium">Medium - Normal Issue</option>
                                            <option value="high">High - Important issue</option>
                                            <option value="urgent">Urgent - Immediate attention required</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="description"
                                        required
                                        rows="6"
                                        placeholder="Describe your complaint in detail. Include dates, course codes, or faculty names if relevant..."
                                        className="input-field resize-none"
                                        value={formData.description}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                {/* Attachments */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Attachments (Optional)</label>
                                    <div className="mt-2 flex flex-col space-y-3">
                                        <label className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl py-8 px-4 hover:bg-gray-50 hover:border-primary-300 transition-all cursor-pointer group">
                                            <div className="text-center">
                                                <HiOutlinePaperClip className="mx-auto h-8 w-8 text-gray-400 group-hover:text-primary-500 group-hover:scale-110 transition-all" />
                                                <span className="mt-2 block text-sm font-medium text-gray-600">Click to upload files</span>
                                                <span className="text-xs text-gray-400">PDF, JPG, PNG or DOCX up to 5MB (Max 3)</span>
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
                                            <div className="grid grid-cols-1 gap-2">
                                                {files.map((file, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                        <div className="flex items-center truncate">
                                                            <HiOutlinePaperClip className="w-5 h-5 text-primary-500 mr-3" />
                                                            <span className="text-xs font-semibold text-gray-700 truncate">{file.name}</span>
                                                            <span className="ml-2 text-[10px] text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(idx)}
                                                            className="p-1 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                                                        >
                                                            <HiOutlineX className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Anonymous Option */}
                                <div className="pt-4 border-t border-gray-50">
                                    <div className="flex items-center px-4 py-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                                        <input
                                            id="isAnonymous"
                                            name="isAnonymous"
                                            type="checkbox"
                                            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            checked={formData.isAnonymous}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="isAnonymous" className="ml-3">
                                            <span className="block text-sm font-bold text-indigo-900 leading-none">Submit Anonymously</span>
                                            <span className="block text-xs text-indigo-700 mt-1">Your identity will be hidden from staff members.</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full md:w-auto px-10 py-3.5 shadow-lg shadow-primary-200 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>Submit Complaint</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="w-full md:w-80 space-y-6">
                    <div className="bg-primary-600 text-white p-6 rounded-3xl shadow-xl shadow-primary-100">
                        <div className="flex items-center gap-3 mb-4">
                            <HiOutlineInformationCircle className="w-6 h-6" />
                            <h3 className="font-bold text-lg">Guidelines</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-primary-50 opacity-90">
                            <li className="flex gap-2">
                                <span className="font-bold">•</span>
                                <span>Be specific about course codes and section numbers.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold">•</span>
                                <span>Attach evidence (screenshots, photos) if available.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold">•</span>
                                <span>Wait for our staff to review your case. Normal turnaround is 3-5 days.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold">•</span>
                                <span>Check notifications for updates from the department.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                            <HiOutlineCheckCircle className="w-5 h-5 mr-2 text-emerald-500" />
                            What Happens Next?
                        </h3>
                        <div className="relative pl-6 space-y-6">
                            {[
                                { label: 'Drafting', desc: 'You are currently here' },
                                { label: 'Staff Review', desc: 'Case is assigned to a faculty member' },
                                { label: 'Investigation', desc: 'Academic records & policies are checked' },
                                { label: 'Resolution', desc: 'A final decision is made and logged' }
                            ].map((step, i) => (
                                <div key={i} className="relative">
                                    {i < 3 && <div className="absolute left-[-17px] top-6 bottom-[-24px] w-0.5 bg-gray-100"></div>}
                                    <div className={`absolute left-[-21px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${i === 0 ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
                                    <div className={`text-sm font-bold ${i === 0 ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</div>
                                    <div className="text-xs text-gray-400 mt-0.5">{step.desc}</div>
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
