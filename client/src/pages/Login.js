import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineArrowRight, HiOutlineShieldCheck, HiOutlineSupport } from 'react-icons/hi';
import toast from 'react-hot-toast';

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

        try {
            const result = await login(email, password);
            if (result.success) {
                toast.success('Access Granted • Welcome to VoiceHU');
                navigate(from, { replace: true });
            } else {
                toast.error('Authentication Failed: Identity Invalid');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Protocol breach detected');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-dark-950 transition-colors duration-500">
            {/* Left Side: Animated Brand Area */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-dark-900 border-r border-white/5">
                <div className="mesh-bg absolute inset-0 opacity-40"></div>

                {/* Decorative floating dots */}
                <div className="floating-dot w-64 h-64 bg-primary-500/20 blur-3xl -top-20 -left-20" style={{ '--duration': '8s' }}></div>
                <div className="floating-dot w-96 h-96 bg-secondary-500/20 blur-3xl bottom-0 right-0" style={{ '--duration': '12s', '--delay': '2s' }}></div>

                <div className="relative z-10 w-full h-full flex flex-col p-16 justify-between">
                    <Link to="/" className="flex items-center space-x-3 group w-fit">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-dark-950 shadow-glow transition-transform group-hover:scale-105 duration-300">
                            <span className="text-2xl font-black italic tracking-tighter">V</span>
                        </div>
                        <span className="text-2xl font-black tracking-tight text-white leading-none">VoiceHU</span>
                    </Link>

                    <div className="max-w-md animate-fade-in-up">
                        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <HiOutlineShieldCheck className="w-4 h-4" />
                            <span>Academic Protocol V3.0</span>
                        </div>
                        <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
                            Elevate the <br />
                            <span className="text-gradient">Student Experience</span>
                        </h2>
                        <p className="text-gray-400 mt-6 text-lg font-medium leading-relaxed">
                            A sophisticated ecosystem designed for seamless grievance orchestration and academic intelligence.
                        </p>
                    </div>

                    <div className="flex items-center space-x-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
                        <div className="flex items-center gap-2">
                            Secure Core
                        </div>
                        <div className="flex items-center gap-2">
                            Real-time Alerts
                        </div>
                        <div className="flex items-center gap-2">
                            Privacy First
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Authentication Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
                <div className="w-full max-w-md space-y-10 animate-fade-in">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-tr from-primary-600 to-secondary-500 rounded-2xl flex items-center justify-center text-white shadow-glow">
                                <span className="text-3xl font-black italic">V</span>
                            </div>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">System Login</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-3 font-medium text-lg">Enter your terminal credentials to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Identity Endpoint</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <HiOutlineMail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="input-field pl-12 h-14"
                                    placeholder="email@haramaya.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Access Protocol</label>
                                <Link to="/forgot-password" size="sm" className="text-[11px] font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest">Recovery</Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <HiOutlineLockClosed className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="input-field pl-12 h-14"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <HiOutlineEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <HiOutlineEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full h-14 flex items-center justify-center text-lg shadow-glow-sm"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <span className="flex items-center">
                                    Authorize Session <HiOutlineArrowRight className="ml-2 w-5 h-5" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">New operator?</span>{' '}
                        <Link to="/register" className="text-primary-600 font-black hover:text-primary-700 transition-colors ml-1 uppercase tracking-widest text-xs">
                            Initialize Account
                        </Link>
                    </div>
                </div>

                {/* Corner support info */}
                <div className="absolute bottom-10 right-10 flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <HiOutlineSupport className="w-4 h-4" />
                    <span>Technical Support: ext-9021</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
