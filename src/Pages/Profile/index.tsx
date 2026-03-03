import { useEffect } from 'react';
import ProfilePage from './ProfilePage';

const Profile = () => {
    useEffect(() => {
        document.title = 'Profile | Aurevia';

        const setMeta = (selector: string, attr: string, content: string) => {
            const el = document.querySelector(selector);
            if (el) {
                el.setAttribute('content', content);
            } else {
                const meta = document.createElement('meta');
                if (attr === 'property') meta.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] || '');
                else meta.name = selector.match(/name="([^"]+)"/)?.[1] || '';
                meta.content = content;
                document.head.appendChild(meta);
            }
        };

        setMeta('meta[name="description"]', 'name', 'Manage your Aurevia profile and preferences.');
        setMeta('meta[property="og:title"]', 'property', 'Profile | Aurevia');
    }, []);

    return <ProfilePage />;
};

export default Profile;
