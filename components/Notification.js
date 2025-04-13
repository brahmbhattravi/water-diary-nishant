import React from 'react';
import './Notification.css';

function Notification({ message, type }) {
  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  );
}

export default Notification; 