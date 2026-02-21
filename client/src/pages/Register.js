import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineMail,
    HiOutlineLockClosed,
    HiOutlineUser,
    HiOutlineIdentification,
    HiOutlineAcademicCap,
    HiOutlinePhone
} from 'react-icons/hi';

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
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        setError('');
        setLoading(true);
        const result = await register(formData);
        setLoading(false);
        if (result.success) {
            navigate('/dashboard');
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100 rounded-full blur-[120px] opacity-60"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-100 rounded-full blur-[120px] opacity-60"></div>
            </div>

            <div className="w-full max-w-2xl relative animate-fade-in my-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-2xl shadow-xl shadow-primary-200 mb-4 text-white">
                        <span className="text-3xl font-bold italic">V</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Your Account</h1>
                    <p className="text-gray-500 mt-2">Join the VoiceHU platform at Haramaya University</p>
                </div>

                <div className="bg-white/80 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-2xl border border-white/20">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        name="name"
                                        required
                                        placeholder="John Doe"
                                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="name@haramaya.edu.et"
                                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Student ID */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID (Optional)</label>
                                <div className="relative">
                                    <HiOutlineIdentification className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        name="studentId"
                                        placeholder="UGR/0000/00"
                                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all"
                                        value={formData.studentId}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Department */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                                <div className="relative">
                                    <HiOutlineAcademicCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <select
                                        name="department"
                                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all appearance-none"
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
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                                <div className="relative">
                                    <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <input
                                id="terms"
                                type="checkbox"
                                required
                                className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-500">
                                I agree to the <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3.5 shadow-lg shadow-primary-200 flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <span>Initialize My Account</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
