import React from 'react';

const Slot = ({ number, isSelected, onClick, channelData }) => {
  // Determine border color based on status
  const borderColor = channelData.status === 'On' ? 'green' : 'red';

  return (
    <div
      className={`slot ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{
        borderColor: borderColor, // Dynamic border color based on status
        zIndex: isSelected ? 100 : 1,
      }}
    >
      {/* Regular slot content */}
      {!isSelected && (
        <>
          <span className="slot-number">{number}</span>
          <span className="slot-name">{channelData.name || ' '}</span>
        </>
      )}

      {/* Empty slot when selected */}
      {isSelected && <div className="empty-slot" />}
    </div>
  );
};

export default Slot;
