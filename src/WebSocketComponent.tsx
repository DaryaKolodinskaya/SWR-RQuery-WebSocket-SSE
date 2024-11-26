import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

type Props = {}

const WebSocketComponent = (props: Props) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [text, setText] = useState<string | undefined>();
  const [isConnected, setIsConnected] = useState(false);

  const ConnectSocket = () => {
    const newSocket = new WebSocket('wss://echo.websocket.org');

    newSocket.onopen = () => {
      toast.success('WebSocket connection established');
      setIsConnected(true);
    };

    newSocket.onerror = () => {
      toast.error('WebSocket error');
      setIsConnected(false);
    };

    newSocket.onclose = () => {
      toast.error('WebSocket connection closed');
      setIsConnected(false);
    };

    setSocket(newSocket);
  };

  const closeSocket = () => {
    if (socket) {
      socket.close();
      setSocket(null);
      setIsConnected(false);
    }
  };

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(text || '');
      socket.onmessage = (msg) => toast('rec data: ' + msg.data)
    } else {
      toast.error('WebSocket is not connected');
    }
  };

  useEffect(() => {
    ConnectSocket();
    return () => {
      closeSocket();
    };
  }, []);

  return (
    <div style={{ border: '1px solid grey', padding: '20px' }}>
      <h2>WebSocketComponent</h2>
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={ConnectSocket}>Connect</button>
        <button onClick={closeSocket}>Disconnect</button>
      </div>
      <div>
        Your msg: <input type="text" onChange={(e) => setText(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
      <Toaster toastOptions={{ position: 'top-center' }} />
    </div>
  );
};

export default WebSocketComponent;
