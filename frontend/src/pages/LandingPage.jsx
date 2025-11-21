import React from 'react';
import { useNavigate } from 'react-router-dom';

const featureData = [
    {
        icon: '📝',
        title: 'Create a Wishlist',
        description: 'Effortlessly list the gifts you truly want and organize your ideas.',
    },
    {
        icon: '🔗',
        title: 'Share and Claim',
        description: 'Generate a unique link to share with loved ones so they can claim a gift.',
    },
    {
        icon: '⚡',
        title: 'Real-Time Updates',
        description: 'See gifts claimed instantly—no duplicates, just perfect surprises!',
    },
];

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStarted = (e) => {
        e.preventDefault();
        navigate('/auth'); 
    };

    const BASE_BUTTON_CLASSES = "px-6 py-3 font-semibold rounded-lg transition duration-300 shadow-md";

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            {/* 1. Hero Section: Welcoming Message and Primary CTA */}
            <header className="bg-white text-center py-20 border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-600 mb-2">
                        Zawify
                    </h1>
                    <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Turn presents into <span className="text-indigo-600">thoughtful moments</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                        Create beautiful wishlists, share them with loved ones, and let them claim gifts in real-time. No more duplicate presents, just perfect surprises.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button 
                            className={`${BASE_BUTTON_CLASSES} bg-indigo-600 text-white hover:bg-indigo-700`}
                            onClick={handleGetStarted}
                        >
                            Get Started
                        </button>
                        <button 
                            className={`${BASE_BUTTON_CLASSES} bg-transparent text-indigo-600 border border-indigo-600 hover:bg-indigo-50`}
                            onClick={handleGetStarted}
                        >
                            Log In / Sign Up
                        </button>
                    </div>
                </div>
            </header>

            {/* 2. Feature Cards Section */}
            <section className="py-16 px-4">
                <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
                    How Zawify Works
                </h3>
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                    {featureData.map((feature, index) => (
                        <div 
                            key={index} 
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100"
                        >
                            <span className="text-4xl block mb-4 text-indigo-600">{feature.icon}</span>
                            <h4 className="text-xl font-semibold mb-3 text-indigo-600">
                                {feature.title}
                            </h4>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
                {/* Secondary CTA placed after the feature explanation */}
                <div className="text-center mt-12">
                    <button 
                        className={`${BASE_BUTTON_CLASSES} bg-indigo-600 text-white hover:bg-indigo-700`}
                        onClick={handleGetStarted}
                    >
                        Create Your First Wishlist Today
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white text-center p-6 mt-12">
                <p>&copy; {new Date().getFullYear()} Zawify. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;