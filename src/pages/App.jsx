import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import {
  VideoGrid,
  VideoCard,
  MainContainer,
  ChatSidebar,
  ChatMessages,
  ChatInput,
  ChatContainer,
  ChatButton
} from './styles'

const socket = io('http://localhost:3000');

function App() {
  const [roomId] = useState('room123');
  const [userId] = useState(Math.floor(Math.random() * 10000).toString());
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [streams] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const videoRef = useRef();
  const peerConnections = useRef({});
  
  useEffect(() => {
    // Captura o vídeo do usuário local
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;

        // Entrar na sala
        socket.emit('join-room', roomId, userId);

        // Novo usuário conectado
        socket.on('user-connected', (newUserId) => {
          console.log(`Novo usuário conectado: ${newUserId}`);
          connectToNewUser(newUserId, stream);
        });

        // Usuário desconectado
        socket.on('user-disconnected', (disconnectedUserId) => {
          console.log(`Usuário desconectado: ${disconnectedUserId}`);
          if (peerConnections.current[disconnectedUserId]) {
            peerConnections.current[disconnectedUserId].close();
            delete peerConnections.current[disconnectedUserId];
          }
        });

        // Receber mensagem de chat
        socket.on('receive-message', (message) => {
          setMessages((prevMessages) => [...prevMessages, message]);
        });
      });

    return () => {
      socket.disconnect();
    };
  }, [roomId, userId]);

  // Função para conectar a um novo usuário com WebRTC
  const connectToNewUser = (newUserId, stream) => {
    const peer = new RTCPeerConnection();

    // Adiciona o stream local às conexões WebRTC
    stream.getTracks().forEach((track) => {
      peer.addTrack(track, stream);
    });

    // Gera uma oferta e envia ao novo usuário via Socket.IO
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('offer', newUserId, peer.localDescription);
      }
    };

    peer.createOffer().then((offer) => {
      peer.setLocalDescription(offer);
    });

    peerConnections.current[newUserId] = peer;

    // Adiciona o stream remoto quando recebido
    peer.ontrack = (event) => {
      // Manipule o stream remoto aqui
      console.log('Novo stream remoto recebido:', event.streams[0]);
    };
  };

  // Enviar mensagem de chat
  const sendMessage = () => {
    const message = { userId, text: chatMessage };
    socket.emit('send-message', message);
    setMessages((prevMessages) => [...prevMessages, message]);
    setChatMessage('');
  };

  return (
    <MainContainer>
      <VideoGrid>
        <VideoCard>
          <video ref={videoRef} autoPlay playsInline />
        </VideoCard>
        {streams.map((stream, index) => (
          <VideoCard key={index}>
            <video ref={(video) => video && (video.srcObject = stream)} autoPlay playsInline />
          </VideoCard>
        ))}
      </VideoGrid>

      <ChatSidebar isOpen={isChatOpen}>
        <ChatContainer>
          <ChatMessages>
            {messages.map((msg, index) => (
              <p key={index}><strong>{msg.userId}:</strong> {msg.text}</p>
            ))}
          </ChatMessages>
          <ChatInput 
            placeholder="Type a message..." 
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
        </ChatContainer>
      </ChatSidebar>

      <ChatButton isOpen={isChatOpen} onClick={() => setIsChatOpen(!isChatOpen)}>
        {isChatOpen ? 'Close Chat' : 'Open Chat'}
      </ChatButton>
    </MainContainer>
  );
}

export default App;
