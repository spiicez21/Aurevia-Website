import { useEffect } from 'react';
import LoginPage from './LoginPage';

const Login = () => {
    useEffect(() => {
        document.title = 'Sign In | Aurevia';

        const setMeta = (selector: string, attr: string, content: string) => {
            const el = document.querySelector(selector);
            if (el) {
                el.setAttribute(attr === 'property' ? 'content' : 'content', content);
            } else {
                const meta = document.createElement('meta');
                if (attr === 'property') meta.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] || '');
                else meta.name = selector.match(/name="([^"]+)"/)?.[1] || '';
                meta.content = content;
                document.head.appendChild(meta);
            }
        };

        setMeta('meta[name="description"]', 'name', 'Sign in to your Aurevia account to continue your conversations.');
        setMeta('meta[property="og:title"]', 'property', 'Sign In | Aurevia');
        setMeta('meta[property="og:description"]', 'property', 'Sign in to your Aurevia account to continue your conversations.');
    }, []);

    return <LoginPage />;
};

export default Login;
