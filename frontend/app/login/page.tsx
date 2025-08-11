'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function SimpleGlassmorphismLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e : any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        alert('로그인 시도');
    };

    return (
        <div className="font-sans h-screen grid place-items-center bg-gradient-to-b from-gray-900 via-slate-800 to-gray-900 p-4 sm:p-6 relative overflow-hidden">
            {/* Road/highway background pattern */}
            <div className="absolute inset-0">
                {/* Highway lines */}
                <div className="absolute inset-0 opacity-20">
                    {/* Center line */}
                    <div className="absolute top-0 left-1/2 w-1 h-full bg-yellow-400 transform -translate-x-1/2"></div>
                    {/* Side lines */}
                    <div className="absolute top-0 left-1/4 w-0.5 h-full bg-white transform -translate-x-1/2"></div>
                    <div className="absolute top-0 right-1/4 w-0.5 h-full bg-white transform translate-x-1/2"></div>

                    {/* Dashed center line effect */}
                    <div className="absolute top-0 left-1/2 w-2 h-full transform -translate-x-1/2"
                         style={{
                             background: `linear-gradient(to bottom, transparent 0%, transparent 45%, #fbbf24 45%, #fbbf24 55%, transparent 55%, transparent 100%)`,
                             backgroundSize: '2px 60px',
                             animation: 'drive 2s linear infinite'
                         }}>
                    </div>
                </div>

                {/* Headlight effect */}
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-radial from-blue-400/10 via-blue-500/5 to-transparent rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* CSS for animation */}
            <style jsx>{`
        @keyframes drive {
          0% { transform: translateX(-50%) translateY(-60px); }
          100% { transform: translateX(-50%) translateY(0px); }
        }
      `}</style>

            <div className="backdrop-blur-lg bg-black/40 border border-white/20 shadow-2xl rounded-2xl p-10 w-full max-w-md text-white relative z-10">
                <h2 className="text-2xl font-semibold mb-6 text-center">Summer Project A</h2>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm mb-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-black/30 rounded-md border border-gray-500/50 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:bg-black/40"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 pr-10 bg-black/30 rounded-md border border-gray-500/50 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:bg-black/40"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full bg-yellow-500/90 hover:bg-yellow-500/80 transition-colors border border-yellow-400/50 text-black py-2 rounded-md font-medium backdrop-blur-sm shadow-lg cursor-pointer"
                    >
                        Sign In
                    </button>
                </div>

                <p className="text-xs text-center mt-6 text-white/60">
                    Don't have an account?{" "}
                    <a href="#" className="text-yellow-300 hover:text-yellow-200 underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}