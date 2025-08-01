import React from 'react';

interface SaveNotificationProps {
  show: boolean;
  message: string;
}

const SaveNotification: React.FC<SaveNotificationProps> = ({ show, message }) => {
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 bg-emerald-500 text-white py-2 px-4 rounded-lg shadow-lg font-pridi transition-all duration-500 transform ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
    >
      {message}
    </div>
  );
};

export default SaveNotification;
