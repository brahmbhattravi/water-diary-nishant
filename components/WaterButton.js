// components/WaterButton.js
import React from 'react';
import styles from '../styles/WaterButton.module.css';

function WaterButton({ amount, color, onClick }) {
  return (
    <button
      className={styles.waterButton}
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {amount}ml
    </button>
  );
}

export default WaterButton;