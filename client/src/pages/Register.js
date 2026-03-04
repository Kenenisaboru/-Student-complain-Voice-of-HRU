import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineMail,
    HiOutlineLockClosed,
    HiOutlineUser,
    HiOutlineIdentification,
    HiOutlineAcademicCap,
    HiOutlineArrowRight,
    HiOutlineShieldCheck
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        studentId: '',
        department: 'Computer Science',
        phone: ''
    });
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Security Breach: Passwords do not match');
        }

        setLoading(true);
        try {
            const result = await register(formData);
            if (result.success) {
                toast.success('Identity Protocol Initialized');
                navigate('/dashboard');
            } else {
                toast.error(result.message || 'Initialization failed');
            }
        } catch (error) {
            toast.error('System error during registration');
        } finally {
            setLoading(false);
        }
    };

    const departments = [
        'Computer Science',
        'Information Technology',
        'Information Systems',
        'Software Engineering',
        'Data Science',
        'Cybersecurity'
    ];

    return (
        <div className="min-h-screen flex bg-white dark:bg-dark-950 transition-colors duration-500">
            {/* Left Side: Animated Brand Area (Flipped for Register to distinguish) */}
            <div className="hidden lg:flex lg:w-1/3 relative overflow-hidden bg-secondary-900 border-r border-white/5">
                <div className="mesh-bg absolute inset-0 opacity-30 animate-pulse-slow"></div>

                <div className="relative z-10 w-full h-full flex flex-col p-12 justify-between">
                    <Link to="/" className="flex items-center space-x-3 group w-fit">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-secondary-950 shadow-glow transition-transform group-hover:scale-105 duration-300">
                            <span className="text-xl font-black italic tracking-tighter">V</span>
                        </div>
                        <span className="text-xl font-black tracking-tight text-white leading-none">VoiceHU</span>
                    </Link>

                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-secondary-500/10 border border-secondary-500/20 text-secondary-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <HiOutlineShieldCheck className="w-4 h-4" />
                            <span>Registration Protocol</span>
                        </div>
                        <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
                            Join the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-primary-300">Intelligent Network</span>
                        </h2>
                        <p className="text-secondary-100/60 mt-4 text-sm font-medium leading-relaxed">
                            Create your academic profile to participate in the most advanced feedback ecosystem at Haramaya University.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-xs font-bold text-secondary-200/50">
                            <div className="w-1 h-1 bg-secondary-400 rounded-full"></div>
                            Verified Student Identity
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-secondary-200/50">
                            <div className="w-1 h-1 bg-secondary-400 rounded-full"></div>
                            Encrypted Data Streams
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Authentication Form */}
            <div className="w-full lg:w-2/3 flex items-center justify-center p-8 md:p-12 overflow-y-auto">
                <div className="w-full max-w-2xl space-y-8 animate-fade-in py-12">
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Initialize Identity</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Please provide your academic credentials to create an endpoint.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Entity Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <HiOutlineUser className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <input
                                        name="name"
                                        required
                                        className="input-field pl-12 h-12"
                                        placeholder="Full Legal Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Email Endpoint</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <HiOutlineMail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="input-field pl-12 h-12"
                                        placeholder="email@haramaya.edu"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Student ID */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Academic ID</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <HiOutlineIdentification className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <input
                                        name="studentId"
                                        className="input-field pl-12 h-12"
                                        placeholder="UGR/0000/00"
                                        value={formData.studentId}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Department */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Faculty/Department</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <HiOutlineAcademicCap className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <select
                                        name="department"
                                        className="input-field pl-12 h-12"
                                        value={formData.department}
                                        onChange={handleChange}
                                    >
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Access Passphrase</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <HiOutlineLockClosed className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="input-field pl-12 h-12"
                                        placeholder="Min 8 characters"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Confirm Protocol</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <HiOutlineLockClosed className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        className="input-field pl-12 h-12"
                                        placeholder="Repeat passphrase"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start ml-1">
                            <input
                                id="terms"
                                type="checkbox"
                                required
                                className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-dark-800 dark:border-gray-700"
                            />
                            <label htmlFor="terms" className="ml-3 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-relaxed">
                                I confirm compliance with the <Link to="/terms" className="text-secondary-500 hover:text-secondary-400 transition-colors">Digital Governance Code</Link> and <Link to="/privacy" className="text-secondary-500 hover:text-secondary-400 transition-colors">Privacy Treaty</Link>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-secondary w-full h-14 flex items-center justify-center text-lg shadow-glow-purple"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <span className="flex items-center">
                                    Establish Identity <HiOutlineArrowRight className="ml-2 w-5 h-5" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">Existing operator?</span>{' '}
                        <Link to="/login" className="text-secondary-600 font-black hover:text-secondary-700 transition-colors ml-1 uppercase tracking-widest text-xs">
                            Access Terminal
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
