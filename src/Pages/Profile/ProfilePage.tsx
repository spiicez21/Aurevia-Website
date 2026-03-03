import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Save, LogOut, ArrowLeft, Loader2, Palette, Globe, Bell } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import apiService from '../../services/apiService';

interface UserProfile {
    id: string;
    username: string;
    email: string;
    avatar: string | null;
    is_active: boolean;
    preferences: {
        theme: string;
        language: string;
        notifications: boolean;
    };
    created_at: string;
}

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Editable fields
    const [username, setUsername] = useState('');
    const [theme, setTheme] = useState('dark');
    const [language, setLanguage] = useState('en');
    const [notifications, setNotifications] = useState(true);

    // Password change
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [isChangingPw, setIsChangingPw] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await apiService.getProfile();
            const user = response.data.user;
            setProfile(user);
            setUsername(user.username);
            setTheme(user.preferences?.theme || 'dark');
            setLanguage(user.preferences?.language || 'en');
            setNotifications(user.preferences?.notifications ?? true);
        } catch {
            setError('Failed to load profile. Please log in.');
            setTimeout(() => navigate('/login'), 2000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSaving(true);

        try {
            const updates: { username?: string; preferences?: Record<string, unknown> } = {};
            if (username !== profile?.username) updates.username = username;
            updates.preferences = { theme, language, notifications };

            const response = await apiService.updateProfile(updates);
            setProfile(response.data.user);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to update profile.';
            setError(message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!currentPassword || !newPassword) {
            setError('Please fill in both password fields.');
            return;
        }
        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters.');
            return;
        }

        setIsChangingPw(true);
        try {
            await apiService.changePassword(currentPassword, newPassword);
            setSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setShowPasswordSection(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to change password.';
            setError(message);
        } finally {
            setIsChangingPw(false);
        }
    };

    const handleLogout = () => {
        apiService.clearToken();
        navigate('/login');
    };

    if (isLoading) {
        return (
            <AuthLayout>
                <div className="flex items-center justify-center py-16">
                    <Loader2 size={32} className="text-olive animate-spin" />
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-zodiak tracking-wide mb-1">
                        Profile
                    </h2>
                    <p className="text-xs text-text-tertiary font-cabinet">
                        Manage your account settings
                    </p>
                </div>
                <Link
                    to="/chat"
                    className="w-10 h-10 bg-charcoal/80 rounded-xl flex items-center justify-center hover:bg-charcoal-light transition-colors border border-gray-700/30"
                    title="Back to chat"
                >
                    <ArrowLeft size={16} className="text-text-secondary" />
                </Link>
            </div>

            {/* Feedback */}
            {error && (
                <div className="mb-5 p-3 bg-red-900/20 border border-red-500/30 rounded-xl text-red-300 text-sm font-cabinet animate-slide-up">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-5 p-3 bg-green-900/20 border border-green-500/30 rounded-xl text-green-300 text-sm font-cabinet animate-slide-up">
                    {success}
                </div>
            )}

            {/* Avatar + Info */}
            <div className="flex items-center gap-4 mb-8 p-4 bg-charcoal/40 rounded-xl border border-gray-700/20">
                <div className="w-14 h-14 bg-olive/20 rounded-full flex items-center justify-center border-2 border-olive/40">
                    <User size={24} className="text-olive" />
                </div>
                <div>
                    <p className="text-base font-cabinet font-semibold text-text-primary">{profile?.username}</p>
                    <p className="text-xs text-text-tertiary font-cabinet flex items-center gap-1">
                        <Mail size={12} /> {profile?.email}
                    </p>
                    <p className="text-xs text-text-muted font-cabinet mt-0.5">
                        Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
                    </p>
                </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSaveProfile} className="space-y-5 mb-6">
                {/* Username */}
                <div>
                    <label htmlFor="profile-username" className="block text-xs text-text-tertiary font-cabinet mb-2 uppercase tracking-wider">
                        Username
                    </label>
                    <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        <input
                            id="profile-username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full h-12 bg-charcoal/80 rounded-xl pl-11 pr-4 text-sm text-text-primary font-cabinet border border-gray-700/30 focus:border-olive/50 focus:outline-none focus:ring-1 focus:ring-olive/30 transition-all duration-200 shadow-[0px_2px_8px_rgba(0,0,0,0.3)]"
                        />
                    </div>
                </div>

                {/* Preferences */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Theme */}
                    <div>
                        <label htmlFor="profile-theme" className="block text-xs text-text-tertiary font-cabinet mb-2 uppercase tracking-wider">
                            <Palette size={12} className="inline mr-1" /> Theme
                        </label>
                        <select
                            id="profile-theme"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            className="w-full h-12 bg-charcoal/80 rounded-xl px-4 text-sm text-text-primary font-cabinet border border-gray-700/30 focus:border-olive/50 focus:outline-none focus:ring-1 focus:ring-olive/30 transition-all duration-200 shadow-[0px_2px_8px_rgba(0,0,0,0.3)] appearance-none cursor-pointer"
                        >
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                            <option value="auto">Auto</option>
                        </select>
                    </div>

                    {/* Language */}
                    <div>
                        <label htmlFor="profile-language" className="block text-xs text-text-tertiary font-cabinet mb-2 uppercase tracking-wider">
                            <Globe size={12} className="inline mr-1" /> Language
                        </label>
                        <select
                            id="profile-language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full h-12 bg-charcoal/80 rounded-xl px-4 text-sm text-text-primary font-cabinet border border-gray-700/30 focus:border-olive/50 focus:outline-none focus:ring-1 focus:ring-olive/30 transition-all duration-200 shadow-[0px_2px_8px_rgba(0,0,0,0.3)] appearance-none cursor-pointer"
                        >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="hi">हिन्दी</option>
                        </select>
                    </div>
                </div>

                {/* Notifications toggle */}
                <div className="flex items-center justify-between p-4 bg-charcoal/40 rounded-xl border border-gray-700/20">
                    <div className="flex items-center gap-3">
                        <Bell size={16} className="text-text-muted" />
                        <span className="text-sm text-text-primary font-cabinet">Notifications</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setNotifications(!notifications)}
                        className={`w-11 h-6 rounded-full transition-all duration-200 relative ${notifications ? 'bg-olive' : 'bg-gray-600'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-200 ${notifications ? 'left-6' : 'left-1'}`} />
                    </button>
                </div>

                {/* Save */}
                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full h-12 bg-olive text-charcoal-dark font-cabinet font-semibold text-sm rounded-xl shadow-[0px_4px_15px_rgba(198,216,110,0.25)] hover:shadow-olive-glow hover:brightness-110 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:shadow-none"
                >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={16} /> Save Changes</>}
                </button>
            </form>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent my-6" />

            {/* Password Section */}
            {!showPasswordSection ? (
                <button
                    onClick={() => setShowPasswordSection(true)}
                    className="w-full h-12 bg-charcoal/80 text-text-secondary font-cabinet font-medium text-sm rounded-xl border border-gray-700/30 hover:border-olive/30 hover:text-text-primary transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <Lock size={16} /> Change Password
                </button>
            ) : (
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <p className="text-xs text-text-tertiary font-cabinet uppercase tracking-wider">Change Password</p>
                    {/* Current */}
                    <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        <input
                            type={showCurrentPw ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Current password"
                            className="w-full h-12 bg-charcoal/80 rounded-xl pl-11 pr-12 text-sm text-text-primary placeholder:text-text-muted font-cabinet border border-gray-700/30 focus:border-olive/50 focus:outline-none focus:ring-1 focus:ring-olive/30 transition-all duration-200 shadow-[0px_2px_8px_rgba(0,0,0,0.3)]"
                        />
                        <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors" tabIndex={-1}>
                            {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {/* New */}
                    <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        <input
                            type={showNewPw ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password (min 6 characters)"
                            className="w-full h-12 bg-charcoal/80 rounded-xl pl-11 pr-12 text-sm text-text-primary placeholder:text-text-muted font-cabinet border border-gray-700/30 focus:border-olive/50 focus:outline-none focus:ring-1 focus:ring-olive/30 transition-all duration-200 shadow-[0px_2px_8px_rgba(0,0,0,0.3)]"
                        />
                        <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors" tabIndex={-1}>
                            {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={isChangingPw}
                            className="flex-1 h-10 bg-olive text-charcoal-dark font-cabinet font-semibold text-sm rounded-xl hover:brightness-110 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isChangingPw ? <Loader2 size={16} className="animate-spin" /> : 'Update Password'}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setShowPasswordSection(false); setCurrentPassword(''); setNewPassword(''); }}
                            className="h-10 px-4 text-text-muted font-cabinet text-sm rounded-xl hover:text-text-secondary transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="w-full h-12 mt-4 bg-red-900/20 text-red-400 font-cabinet font-medium text-sm rounded-xl border border-red-500/20 hover:bg-red-900/30 hover:border-red-500/40 transition-all duration-200 flex items-center justify-center gap-2"
            >
                <LogOut size={16} /> Sign Out
            </button>
        </AuthLayout>
    );
};

export default ProfilePage;
