import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";

const VideoCall = ({ userId, receiverId }) => {
  const [peer, setPeer] = useState(null);
  const [myPeerId, setMyPeerId] = useState(""); // State to store the peer ID
  const [myStream, setMyStream] = useState(null);
  const [peerList, setPeerList] = useState([]);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    // if (userId) {
      const newPeer = new Peer(userId);
      setPeer(newPeer);

      console.log(newPeer);
      newPeer.on("open", (id) => {
        console.log(`${id} connected`);
        setMyPeerId(id); // Set the peer ID when the connection is open
      });

      newPeer.on("error", (err) => {
        console.error("PeerJS error:", err);
      });

      newPeer.on("call", (call) => {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            setMyStream(stream);
            addLocalVideo(stream);
            call.answer(stream);
            call.on("stream", (remoteStream) => {
              if (!peerList.includes(call.peer)) {
                addRemoteVideo(remoteStream);
                setPeerList([...peerList, call.peer]);
              }
            });
          })
          .catch((err) => {
            console.error("Unable to access media devices:", err);
          });
      });

      return () => newPeer.destroy();
    // }
  }, [userId]);

  const addLocalVideo = (stream) => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.muted = true;
      localVideoRef.current.play();
    }
  };

  const addRemoteVideo = (stream) => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
      remoteVideoRef.current.play();
    }
  };

  const makeCall = () => {
    if (peer && receiverId) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setMyStream(stream);
          addLocalVideo(stream);
          const call = peer.call(receiverId, stream);
          call.on("stream", (remoteStream) => {
            if (!peerList.includes(call.peer)) {
              addRemoteVideo(remoteStream);
              setPeerList([...peerList, call.peer]);
            }
          });
        })
        .catch((err) => {
          console.error("Unable to access media devices:", err);
        });
    }
  };

  const toggleVideo = (enabled) => {
    if (myStream) {
      myStream.getVideoTracks()[0].enabled = enabled;
    }
  };

  const toggleAudio = (enabled) => {
    if (myStream) {
      myStream.getAudioTracks()[0].enabled = enabled;
    }
  };
  return (
    <div>
      <h2>Your ID: {myPeerId}</h2> {/* Display the user's ID */}
      <div id="localVideoContainer">
        <video ref={localVideoRef} className="video"></video>
      </div>
      <div id="remoteVideoContainer">
        <video ref={remoteVideoRef} className="video"></video>
      </div>
      <button onClick={() => toggleVideo(true)}>Enable Video</button>
      <button onClick={() => toggleVideo(false)}>Disable Video</button>
      <button onClick={() => toggleAudio(true)}>Enable Audio</button>
      <button onClick={() => toggleAudio(false)}>Disable Audio</button>
      <button onClick={makeCall}>Call</button>
    </div>
  );
};

export default VideoCall;
