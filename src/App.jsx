import React, { useState } from 'react';
import VideoCall from './VideoCall';

const App = () => {
  const [userId, setUserId] = useState('');
  const [receiverId, setReceiverId] = useState('');

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleReceiverIdChange = (e) => {
    setReceiverId(e.target.value);
  };

  return (
    <div>
      <h1>Video Call App</h1>
      <div>
        <label>
          Your ID:
          <input type="text" value={userId} onChange={handleUserIdChange} />
        </label>
      </div>
      <div>
        <label>
          Receiver ID:
          <input type="text" value={receiverId} onChange={handleReceiverIdChange} />
        </label>
      </div>
      <VideoCall userId={userId} receiverId={receiverId} />
    </div>
  );
};

export default App;
