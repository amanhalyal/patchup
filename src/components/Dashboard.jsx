// src/components/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css'; // Import the CSS file
import Slot from './Slot'; // Assuming you have a Slot component

function Dashboard() {
  const [channels, setChannels] = useState([]); // Initialize your channels state
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    auth.currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//localhost:8080/ws?token=${idToken}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connection opened');
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Received:', message);
        // Update channels state with incoming data
        if (message.type === 'initialData') {
          setChannels(Object.values(message.data));
        } else if (message.type === 'update') {
          setChannels((prevChannels) => {
            const updatedChannels = [...prevChannels];
            const index = updatedChannels.findIndex(
              (channel) => channel.channelNumber === message.data.channelNumber
            );
            if (index !== -1) {
              updatedChannels[index] = message.data;
            } else {
              updatedChannels.push(message.data);
            }
            return updatedChannels;
          });
        }
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      // Clean up on component unmount
      return () => {
        ws.close();
      };
    });
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/login');
    });
  };

  const handleSlotClick = (slotNumber) => {
    setSelectedSlot(slotNumber === selectedSlot ? null : slotNumber);
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
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
      </div>
    </div>
  );
}

export default Dashboard;
