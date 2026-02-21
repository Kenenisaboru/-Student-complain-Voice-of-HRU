import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        if (result.success) {
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-100 rounded-full blur-[120px] opacity-60"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-100 rounded-full blur-[120px] opacity-60"></div>
            </div>

            <div className="w-full max-w-md relative animate-fade-in">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-2xl shadow-xl shadow-primary-200 mb-4 text-white">
                        <span className="text-3xl font-bold italic">V</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome to VoiceHU</h1>
                    <p className="text-gray-500 mt-2">Sign in to manage academic complaints</p>
                </div>

                <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    placeholder="name@haramaya.edu.et"
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-semibold text-gray-700">Password</label>
                                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-primary-600 hover:text-primary-700">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-500 select-none">
                                Remember me for 30 days
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
                                <span>Sign In to Platform</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700">
                            Create an account
                        </Link>
                    </div>
                </div>

                {/* Demo Credentials Hint */}
                <div className="mt-8 p-4 bg-primary-50 rounded-2xl border border-primary-100 text-xs text-primary-700">
                    <p className="font-bold mb-1 uppercase tracking-wider">Demo Credentials:</p>
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <p className="font-semibold">Admin:</p>
                            <p>admin@haramaya.edu.et</p>
                        </div>
                        <div>
                            <p className="font-semibold">Staff:</p>
                            <p>staff@haramaya.edu.et</p>
                        </div>
                        <div>
                            <p className="font-semibold">Student:</p>
                            <p>student@haramaya.edu.et</p>
                        </div>
                    </div>
                    <p className="mt-2 italic">* Password for all: Admin@12345 (Staff@12345 / Student@12345)</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
