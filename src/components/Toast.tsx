import React, { useEffect, useState, useCallback } from 'react';

let showToastGlobal: (msg: string) => void = () => {};

export const useToast = () => {
  return { showToast: showToastGlobal };
};

export const Toast: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const show = useCallback((msg: string) => {
    setMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
  }, []);

  useEffect(() => {
    showToastGlobal = show;
  }, [show]);

  return (
    <div className={`toast ${visible ? 'show' : ''}`} role="alert" aria-live="polite">
      <span style={{ color: 'var(--gold)' }}>✦</span>
      <span>{message}</span>
    </div>
  );
};

export { showToastGlobal as showToast };
