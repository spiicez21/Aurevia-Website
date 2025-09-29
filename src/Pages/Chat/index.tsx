import { useEffect } from 'react';
import ChatWelcome from './ChatWelcome';

const Chat = () => {
  useEffect(() => {
    // Set document title
    document.title = 'Chat Interface | Aurevia - Seamless Messaging Experience';
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Start your conversation with Aurevia\'s intuitive chat interface. Experience personalized messaging with our elegant dark-themed design optimized for comfortable communication.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Start your conversation with Aurevia\'s intuitive chat interface. Experience personalized messaging with our elegant dark-themed design optimized for comfortable communication.';
      document.head.appendChild(meta);
    }

    // Set Open Graph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Chat Interface | Aurevia - Seamless Messaging Experience');
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      meta.content = 'Chat Interface | Aurevia - Seamless Messaging Experience';
      document.head.appendChild(meta);
    }

    // Set Open Graph description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Start your conversation with Aurevia\'s intuitive chat interface. Experience personalized messaging with our elegant dark-themed design optimized for comfortable communication.');
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:description');
      meta.content = 'Start your conversation with Aurevia\'s intuitive chat interface. Experience personalized messaging with our elegant dark-themed design optimized for comfortable communication.';
      document.head.appendChild(meta);
    }
  }, []);

  return <ChatWelcome />;
};

export default Chat;