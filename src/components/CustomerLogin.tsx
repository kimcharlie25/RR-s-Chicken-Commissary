import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { useCustomerAuth } from '../hooks/useCustomerAuth';

const CustomerLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, loading, error } = useCustomerAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(username, password);
    };

    return (
        <div className="min-h-screen bg-branding-yellow flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border-4 border-branding-primary/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-branding-red"></div>
                <div className="text-center mb-10">
                    <div className="mx-auto w-20 h-20 bg-branding-red rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-branding-red/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Lock className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-branding-primary mt-2 uppercase tracking-tighter">Commissary Access</h1>
                    <p className="text-branding-primary/60 font-medium mt-2">Login to start your session</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-branding-primary/50 mb-2 flex items-center gap-2 uppercase tracking-widest">
                            <User className="h-3 w-3 text-branding-red" />
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-5 py-4 border-2 border-branding-yellow/20 rounded-2xl focus:ring-4 focus:ring-branding-yellow/10 focus:border-branding-red/50 transition-all outline-none font-bold text-branding-primary placeholder:text-branding-primary/20 bg-branding-yellow/5"
                            placeholder="Your Username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-branding-primary/50 mb-2 flex items-center gap-2 uppercase tracking-widest">
                            <Lock className="h-3 w-3 text-branding-red" />
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 border-2 border-branding-yellow/20 rounded-2xl focus:ring-4 focus:ring-branding-yellow/10 focus:border-branding-red/50 transition-all outline-none pr-12 font-bold text-branding-primary placeholder:text-branding-primary/20 bg-branding-yellow/5"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                            <p className="text-red-600 text-sm text-center">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-branding-red text-white py-5 rounded-2xl hover:opacity-90 transition-all duration-200 font-black uppercase tracking-widest shadow-xl shadow-branding-red/30 disabled:opacity-50 active:scale-95"
                    >
                        {loading ? 'Opening Vault...' : 'Enter Commissary'}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400 italic">
                        RR's Chicken Commissary Management System
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CustomerLogin;
