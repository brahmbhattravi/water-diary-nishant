// pages/index.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [todayTotal, setTodayTotal] = useState(null);
  const [loading, setLoading] = useState(true);

  const waterAmounts = [
    { amount: 150, color: '#FF6B6B' },
    { amount: 300, color: '#4ECDC4' },
    { amount: 350, color: '#45B7D1' },
    { amount: 450, color: '#96CEB4' }
  ];

  const fetchTodayTotal = async () => {
    try {
      const response = await fetch('/api/get-today-total');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch today\'s total');
      }
      
      setTodayTotal(data.total);
    } catch (err) {
      console.error('Error fetching today\'s total:', err);
      setNotification({
        message: 'Failed to fetch today\'s total. Please refresh the page.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayTotal();
  }, []);

  const handleWaterLog = async (amount) => {
    try {
      const response = await fetch('/api/log-water', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to log water intake');
      }

      setNotification({ message: 'Water intake logged successfully!', type: 'success' });
      fetchTodayTotal();
    } catch (err) {
      console.error('Error logging water intake:', err);
      setNotification({ 
        message: err.message || 'Failed to log water intake', 
        type: 'error' 
      });
    }

    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  return (
    <div className={styles.app}>
      <h1>Water Intake Tracker</h1>
      <div className={styles.todayTotal}>
        {loading ? (
          'Loading today\'s total...'
        ) : (
          <>
            You have drunk <span className={styles.totalAmount}>{todayTotal || 0}ml</span> water today
          </>
        )}
      </div>
      <div className={styles.buttonContainer}>
        {waterAmounts.map((item) => (
          <button
            key={item.amount}
            className={styles.waterButton}
            style={{ backgroundColor: item.color }}
            onClick={() => handleWaterLog(item.amount)}
          >
            {item.amount}ml
          </button>
        ))}
      </div>
      {notification.message && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}