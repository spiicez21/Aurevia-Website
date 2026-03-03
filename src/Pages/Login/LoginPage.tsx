import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import apiService from '../../services/apiService';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Please fill in all fields.');
            return;
        }

        setIsLoading(true);
        try {
            await apiService.login({ email: email.trim(), password });
            navigate('/chat');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            {/* Heading */}
            <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-zodiak tracking-wide mb-2">
                    Welcome Back
                </h2>
                <p className="text-sm text-text-tertiary font-cabinet">
                    Sign in to continue your conversations
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 p-3 bg-red-900/20 border border-red-500/30 rounded-xl text-red-300 text-sm font-cabinet animate-slide-up">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                    <label htmlFor="login-email" className="block text-xs text-text-tertiary font-cabinet mb-2 uppercase tracking-wider">
                        Email
                    </label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            disabled={isLoading}
                            className="w-full h-12 bg-charcoal/80 rounded-xl pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted font-cabinet border border-gray-700/30 focus:border-olive/50 focus:outline-none focus:ring-1 focus:ring-olive/30 transition-all duration-200 shadow-[0px_2px_8px_rgba(0,0,0,0.3)] disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="login-password" className="block text-xs text-text-tertiary font-cabinet mb-2 uppercase tracking-wider">
                        Password
                    </label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        <input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            disabled={isLoading}
                            className="w-full h-12 bg-charcoal/80 rounded-xl pl-11 pr-12 text-sm text-text-primary placeholder:text-text-muted font-cabinet border border-gray-700/30 focus:border-olive/50 focus:outline-none focus:ring-1 focus:ring-olive/30 transition-all duration-200 shadow-[0px_2px_8px_rgba(0,0,0,0.3)] disabled:opacity-50"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-olive text-charcoal-dark font-cabinet font-semibold text-sm rounded-xl shadow-[0px_4px_15px_rgba(198,216,110,0.25)] hover:shadow-olive-glow hover:brightness-110 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:shadow-none disabled:hover:brightness-100 disabled:active:scale-100"
                >
                    {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <>
                            <LogIn size={16} />
                            Sign In
                        </>
                    )}
                </button>
            </form>

            {/* Footer link */}
            <div className="mt-8 text-center">
                <p className="text-sm text-text-tertiary font-cabinet">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="text-olive hover:text-olive-light font-medium transition-colors duration-200"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
