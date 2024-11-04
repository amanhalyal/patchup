import React, { useEffect, useState } from 'react';
import Slot from './Slot';
import '../Dashboard.css';

const Dashboard = () => {
  const [channels, setChannels] = useState(
    Array(48).fill({
      name: '',
      status: '',
      attention: '',
    })
  );

  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSlotClick = (slotNumber) => {
    setSelectedSlot(slotNumber);
  };

  const handleOverlayClick = () => {
    setSelectedSlot(null);
  };

  // Connect to WebSocket and update channels state
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'initialData') {
        const initialData = message.data;
        setChannels((prevChannels) => {
          const updatedChannels = [...prevChannels];
          Object.values(initialData).forEach((channelData) => {
            updatedChannels[channelData.channelNumber - 1] = channelData;
          });
          return updatedChannels;
        });
      } else if (message.type === 'update') {
        const channelData = message.data;
        setChannels((prevChannels) => {
          const updatedChannels = [...prevChannels];
          updatedChannels[channelData.channelNumber - 1] = channelData;
          return updatedChannels;
        });
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const selectedDevice = selectedSlot !== null ? channels[selectedSlot - 1] : null;

  // Determine border color based on status for expanded card
  const borderColor = selectedDevice?.status === 'On' ? 'green' : 'red';

  return (
    <div className="dashboard">
      {/* Grid with slots */}
      <div className={`grid-container ${selectedSlot ? 'blurred' : ''}`}>
        {channels.map((channel, index) => (
          <Slot
            key={index + 1}
            number={index + 1}
            channelData={channel}
            isSelected={selectedSlot === index + 1}
            onClick={() => handleSlotClick(index + 1)}
          />
        ))}
      </div>

      {/* Only render the expanded card as an overlay */}
      {selectedSlot && selectedDevice && (
        <div className="card-overlay" onClick={handleOverlayClick}>
          <div className="expanded-card" style={{ borderColor: borderColor }}>
            <div className="db-level">
              <span className="level-display">8.8</span> {/* Placeholder */}
            </div>
            <p className="card-info">{selectedDevice.name}</p>
            <p className="card-info">Patch Name: {selectedDevice.attention}</p>
            <p className="card-info">dB Level: XX</p> {/* Placeholder */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
