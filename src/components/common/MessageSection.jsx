import { useState, useCallback } from 'react';
import MessageForm from './MessageForm';
import MessageDisplay from './MessageDisplay';

const MessageSection = ({ journeySection, onFormStateChange }) => {
  const [refreshMessages, setRefreshMessages] = useState(null);

  const handleMessageSent = useCallback((newMessage) => {
    // Force refresh messages when a new message is sent
    if (refreshMessages) {
      setTimeout(() => {
        refreshMessages();
      }, 100); // Small delay to ensure the message is saved
    }
  }, [refreshMessages]);

  const handleRefreshSetup = useCallback((refreshFunction) => {
    setRefreshMessages(() => refreshFunction);
  }, []);

  return (
    <>
      <MessageForm 
        journeySection={journeySection} 
        onFormStateChange={onFormStateChange}
        onMessageSent={handleMessageSent}
      />
      <MessageDisplay 
        journeySection={journeySection} 
        onRefresh={handleRefreshSetup}
      />
    </>
  );
};

export default MessageSection;
