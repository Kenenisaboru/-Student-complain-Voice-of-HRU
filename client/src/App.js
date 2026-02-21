import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ComplaintList from './pages/ComplaintList';
import ComplaintCreate from './pages/ComplaintCreate';
import ComplaintDetail from './pages/ComplaintDetail';
import Notifications from './pages/Notifications';

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/complaints" element={<ComplaintList />} />
                        <Route path="/complaints/new" element={<ComplaintCreate />} />
                        <Route path="/complaints/:id" element={<ComplaintDetail />} />
                        <Route path="/notifications" element={<Notifications />} />

                        {/* Fallback internal */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Route>

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>

                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#fff',
                            color: '#1e293b',
                            borderRadius: '16px',
                            padding: '12px 24px',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            fontWeight: '500',
                            fontSize: '14px'
                        },
                    }}
                />
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
