import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Save, LogOut, X, Loader2, Palette, Globe, Bell } from 'lucide-react';
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

interface ProfilePopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [username, setUsername] = useState('');
    const [theme, setTheme] = useState('dark');
    const [language, setLanguage] = useState('en');
    const [notifications, setNotifications] = useState(true);

    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [isChangingPw, setIsChangingPw] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadProfile();
        }
    }, [isOpen]);

    const loadProfile = async () => {
        setIsLoading(true);
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
            setTimeout(() => { onClose(); navigate('/login'); }, 2000);
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
            setSuccess('Profile updated!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update profile.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!currentPassword || !newPassword) { setError('Fill in both fields.'); return; }
        if (newPassword.length < 6) { setError('Min 6 characters.'); return; }
        setIsChangingPw(true);
        try {
            await apiService.changePassword(currentPassword, newPassword);
            setSuccess('Password changed!');
            setCurrentPassword('');
            setNewPassword('');
            setShowPasswordSection(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to change password.');
        } finally {
            setIsChangingPw(false);
        }
    };

    const handleLogout = () => {
        apiService.clearToken();
        onClose();
        navigate('/login');
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-[3px] z-40" onClick={onClose} />

            {/* Popup Card */}
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md max-h-[85vh] overflow-y-auto bg-charcoal-dark/95 backdrop-blur-md rounded-2xl shadow-[0px_8px_40px_rgba(0,0,0,0.6)] border border-gray-700/30 animate-fade-in">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-zodiak tracking-wide" style={{ color: '#C6D86E' }}>Profile</h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-charcoal/60 transition-colors"
                        >
                            <X size={16} className="text-text-muted" />
                        </button>
                    </div>

                    {/* Feedback */}
                    {error && (
                        <div className="mb-4 p-2.5 bg-red-900/20 border border-red-500/30 rounded-xl text-red-300 text-xs font-cabinet">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-2.5 bg-green-900/20 border border-green-500/30 rounded-xl text-green-300 text-xs font-cabinet">
                            {success}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 size={24} className="text-olive animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* Avatar + Info */}
                            <div className="flex items-center gap-3 mb-6 p-3 bg-charcoal/40 rounded-xl border border-gray-700/20">
                                <div className="w-11 h-11 bg-olive/20 rounded-full flex items-center justify-center border-2 border-olive/40">
                                    <User size={18} className="text-olive" />
                                </div>
                                <div>
                                    <p className="text-sm font-cabinet font-semibold text-text-primary">{profile?.username}</p>
                                    <p className="text-[10px] text-text-tertiary font-cabinet flex items-center gap-1">
                                        <Mail size={10} /> {profile?.email}
                                    </p>
                                    <p className="text-[10px] text-text-muted font-cabinet">
                                        Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
                                    </p>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSaveProfile} className="space-y-4 mb-4">
                                {/* Username */}
                                <div>
                                    <label htmlFor="popup-username" className="block text-[10px] text-text-tertiary font-cabinet mb-1.5 uppercase tracking-wider">Username</label>
                                    <div className="relative">
                                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                        <input
                                            id="popup-username"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full h-10 bg-charcoal/80 rounded-lg pl-9 pr-3 text-xs text-text-primary font-cabinet border border-gray-700/30 focus:border-olive/50 focus:outline-none focus:ring-1 focus:ring-olive/30 transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                {/* Preferences row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="popup-theme" className="block text-[10px] text-text-tertiary font-cabinet mb-1.5 uppercase tracking-wider">
                                            <Palette size={10} className="inline mr-0.5" /> Theme
                                        </label>
                                        <select
                                            id="popup-theme"
                                            value={theme}
                                            onChange={(e) => setTheme(e.target.value)}
                                            className="w-full h-10 bg-charcoal/80 rounded-lg px-3 text-xs text-text-primary font-cabinet border border-gray-700/30 focus:border-olive/50 focus:outline-none focus:ring-1 focus:ring-olive/30 transition-all duration-200 appearance-none cursor-pointer"
                                        >
                                            <option value="dark">Dark</option>
                                            <option value="light">Light</option>
                                            <option value="auto">Auto</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="popup-lang" className="block text-[10px] text-text-tertiary font-cabinet mb-1.5 uppercase tracking-wider">
                                            <Globe size={10} className="inline mr-0.5" /> Language
                                        </label>
                                        <select
                                            id="popup-lang"
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className="w-full h-10 bg-charcoal/80 rounded-lg px-3 text-xs text-text-primary font-cabinet border border-gray-700/30 focus:border-olive/50 focus:outline-none focus:ring-1 focus:ring-olive/30 transition-all duration-200 appearance-none cursor-pointer"
                                        >
                                            <option value="en">English</option>
                                            <option value="es">Español</option>
                                            <option value="fr">Français</option>
                                            <option value="de">Deutsch</option>
                                            <option value="hi">हिन्दी</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Notifications */}
                                <div className="flex items-center justify-between p-3 bg-charcoal/40 rounded-xl border border-gray-700/20">
                                    <div className="flex items-center gap-2">
                                        <Bell size={14} className="text-text-muted" />
                                        <span className="text-xs text-text-primary font-cabinet">Notifications</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setNotifications(!notifications)}
                                        className={`w-10 h-5 rounded-full transition-all duration-200 relative ${notifications ? 'bg-olive' : 'bg-gray-600'}`}
                                    >
                                        <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all duration-200 ${notifications ? 'left-5' : 'left-1'}`} />
                                    </button>
                                </div>

                                {/* Save */}
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full h-10 bg-olive text-charcoal-dark font-cabinet font-semibold text-xs rounded-xl shadow-[0px_4px_15px_rgba(198,216,110,0.25)] hover:shadow-olive-glow hover:brightness-110 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> Save Changes</>}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent my-4" />

                            {/* Password */}
                            {!showPasswordSection ? (
                                <button
                                    onClick={() => setShowPasswordSection(true)}
                                    className="w-full h-9 bg-charcoal/80 text-text-secondary font-cabinet font-medium text-xs rounded-xl border border-gray-700/30 hover:border-olive/30 hover:text-text-primary transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <Lock size={14} /> Change Password
                                </button>
                            ) : (
                                <form onSubmit={handleChangePassword} className="space-y-3">
                                    <p className="text-[10px] text-text-tertiary font-cabinet uppercase tracking-wider">Change Password</p>
                                    <div className="relative">
                                        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                        <input
                                            type={showCurrentPw ? 'text' : 'password'}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Current password"
                                            className="w-full h-10 bg-charcoal/80 rounded-lg pl-9 pr-10 text-xs text-text-primary placeholder:text-text-muted font-cabinet border border-gray-700/30 focus:border-olive/50 focus:outline-none focus:ring-1 focus:ring-olive/30 transition-all duration-200"
                                        />
                                        <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors" tabIndex={-1}>
                                            {showCurrentPw ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                        <input
                                            type={showNewPw ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="New password (min 6 chars)"
                                            className="w-full h-10 bg-charcoal/80 rounded-lg pl-9 pr-10 text-xs text-text-primary placeholder:text-text-muted font-cabinet border border-gray-700/30 focus:border-olive/50 focus:outline-none focus:ring-1 focus:ring-olive/30 transition-all duration-200"
                                        />
                                        <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors" tabIndex={-1}>
                                            {showNewPw ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            disabled={isChangingPw}
                                            className="flex-1 h-9 bg-olive text-charcoal-dark font-cabinet font-semibold text-xs rounded-xl hover:brightness-110 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isChangingPw ? <Loader2 size={14} className="animate-spin" /> : 'Update'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setShowPasswordSection(false); setCurrentPassword(''); setNewPassword(''); }}
                                            className="h-9 px-3 text-text-muted font-cabinet text-xs rounded-xl hover:text-text-secondary transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="w-full h-9 mt-3 bg-red-900/20 text-red-400 font-cabinet font-medium text-xs rounded-xl border border-red-500/20 hover:bg-red-900/30 hover:border-red-500/40 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <LogOut size={14} /> Sign Out
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProfilePopup;
