// src/components/Card.jsx
import React from 'react';
import '../Card.css';

const Card = ({ device }) => {
  const statusClass =
    device.status === 'On' ? 'card-connected' : 'card-disconnected';

  const handleCardClick = (event) => {
    // Prevent the click event from propagating to the overlay
    event.stopPropagation();
  };

  return (
    <div className={`card ${statusClass}`} onClick={handleCardClick}>
      <div className="card-header">
        <h2>{device.name}</h2>
      </div>
      <div className="card-body">
        <p>Status: {device.status}</p>
        <p>Attention: {device.attention}</p>
      </div>
    </div>
  );
};

export default Card;
