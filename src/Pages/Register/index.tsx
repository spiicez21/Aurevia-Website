import { useEffect } from 'react';
import RegisterPage from './RegisterPage';

const Register = () => {
    useEffect(() => {
        document.title = 'Create Account | Aurevia';

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

        setMeta('meta[name="description"]', 'name', 'Create your Aurevia account and start chatting with AI.');
        setMeta('meta[property="og:title"]', 'property', 'Create Account | Aurevia');
        setMeta('meta[property="og:description"]', 'property', 'Create your Aurevia account and start chatting with AI.');
    }, []);

    return <RegisterPage />;
};

export default Register;
