import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data.user);
                } catch (error) {
                    console.error('Failed to fetch user', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const { token, user: userData } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            toast.success('Successfully logged in!');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const register = async (formData) => {
        try {
            const res = await api.post('/auth/register', formData);
            const { token, user: userData } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            toast.success('Account created successfully!');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Logged out successfully');
    };

    const updateProfile = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
