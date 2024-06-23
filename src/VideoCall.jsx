import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import "./App.css";

function App() {
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  const config = {
    iceServers: [
      {
        urls: "stun:stun.relay.metered.ca:80",
      },
      {
        urls: "turn:global.relay.metered.ca:80",
        username: "4af99e420a35edd224652392",
        credential: "eEltkjk72tCOQ93L",
      },
      {
        urls: "turn:global.relay.metered.ca:80?transport=tcp",
        username: "4af99e420a35edd224652392",
        credential: "eEltkjk72tCOQ93L",
      },
      {
        urls: "turn:global.relay.metered.ca:443",
        username: "4af99e420a35edd224652392",
        credential: "eEltkjk72tCOQ93L",
      },
      {
        urls: "turns:global.relay.metered.ca:443?transport=tcp",
        username: "4af99e420a35edd224652392",
        credential: "eEltkjk72tCOQ93L",
      },
    ],
  };

  useEffect(() => {
    const peer = new Peer(undefined, {
      host: "peer.harshjmhr.xyz",
      // port: 9000,
      path: "/myapp",
      config: config,
    });

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream);
        call.on("stream", function (remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      });
    });

    peerInstance.current = peer;
  }, []);

  const call = (remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream);

      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    });
  };

  return (
    <div className="App">
      <h1>Current user id is {peerId}</h1>
      <input
        type="text"
        value={remotePeerIdValue}
        onChange={(e) => setRemotePeerIdValue(e.target.value)}
      />
      <button onClick={() => call(remotePeerIdValue)}>Call</button>
      <div>
        <video muted ref={currentUserVideoRef} />
      </div>
      <div>
        <video ref={remoteVideoRef} />
      </div>
    </div>
  );
}

export default App;
