import { useState, useEffect } from 'react';

const SSEComponent = () => {
  const [data, setData] = useState<{ msg?: string; date?: Date }>({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const evtSource = new EventSource('https://sse.dev/test');

    evtSource.onopen = () => {
      console.log('SSE connection opened');
      setIsConnected(true);
    };

    evtSource.onmessage = (e) => {
      console.log('Received message:', e.data);
      const parsedData = JSON.parse(e.data);
      setData({
        msg: parsedData.msg,
        date: new Date(parsedData.now),
      });
    };

    evtSource.onerror = () => {
      console.error('SSE connection error');
      setIsConnected(false);
      evtSource.close();
    };

    return () => {
      console.log('Closing SSE connection');
      evtSource.close();
    };
  }, []);

  return (
    <div style={{ border: '1px solid grey', padding: '20px' }}>
      <h2>SSEComponent msg flow:</h2>
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      <div>
        <strong>Latest Message:</strong>
        <div>Message: {data.msg || 'No message yet'}</div>
        <div>Date: {data.date ? data.date.toLocaleString() : 'No date yet'}</div>
      </div>
    </div>
  );
};

export default SSEComponent;

