// src/components/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import Slot from './Slot';
import '../Dashboard.css';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [channels, setChannels] = useState(
    Array(48).fill({
      name: '',
      status: '',
      attention: '',
    })
  );

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const navigate = useNavigate();

  const handleSlotClick = (slotNumber) => {
    setSelectedSlot(slotNumber);
  };

  const handleOverlayClick = () => {
    setSelectedSlot(null);
  };

  useEffect(() => {
    let ws;

    const connectWebSocket = async () => {
      try {
        const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//localhost:8080/ws?token=${idToken}`;
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('WebSocket connection opened');
        };

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

        ws.onclose = () => {
          console.log('WebSocket connection closed');
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      } catch (error) {
        console.error('Error connecting WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const selectedDevice = selectedSlot !== null ? channels[selectedSlot - 1] : null;

  // Determine border color based on status for expanded card
  const borderColor = selectedDevice?.status === 'On' ? 'green' : 'red';

  const captureCurrentState = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
      await axios.post(
        'http://localhost:8080/capture-current-state',
        { channels },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      console.log('Current state captured successfully');
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error('Error capturing current state:', error);
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/login');
    });
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <div className="capture-controls">
        <button onClick={captureCurrentState}>Capture Current State</button>
      </div>
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

        {/* Modal for capture success */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Success</h2>
              <p>Current state captured successfully!</p>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
