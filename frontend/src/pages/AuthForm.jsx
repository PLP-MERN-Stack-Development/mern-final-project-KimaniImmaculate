import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { name, email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

       const BACKEND_BASE_URL = 'https://zawify-2.onrender.com';

    const endpoint = isLogin 
        ? `${BACKEND_BASE_URL}/api/auth/login` 
        : `${BACKEND_BASE_URL}/api/auth/register`;

        try {
            const res = await axios.post(endpoint, formData);
            
            // Save token and redirect
            localStorage.setItem('token', res.data.token);
            navigate('/create-wishlist');

        } catch (err) {
            console.error("Auth error:", err.response || err);
            setError(
                err.response?.data?.msg || 
                err.response?.data?.message || 
                  'Network error – check your connection or ensure the backend service is running'            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
                
                <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">
                    {isLogin ? 'Welcome Back!' : 'Join Zawify'}
                </h2>
                
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit}>
                    
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={onChange}
                                required={!isLogin}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Your Name"
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                            minLength={6}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-indigo-600 font-semibold hover:text-indigo-800 transition duration-150"
                        disabled={loading}
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;