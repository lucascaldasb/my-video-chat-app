/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import Peer from "peerjs"
import Videocam from '@mui/icons-material/Videocam'
import MicIcon from '@mui/icons-material/Mic'
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import MicOffIcon from '@mui/icons-material/MicOff'
import {
  VideoGrid,
  VideoCard,
  MainContainer,
  ChatSidebar,
  ChatMessages,
  ChatInput,
  ChatContainer,
  ChatButton,
  IconContainer,
  IconBackground,
  CallInput,
  CallInputContainer,
  CallLabel,
  CallButton,
  Column,
  Row
} from './styles'

const socket = io.connect('http://localhost:5000')

function App() {
  const [peerId, setPeerId] = useState(null)
  const [remotePeerId, setRemotePeerId] = useState(null)
  const [remoteCallIdValue, setRemoteCallIdValue] = useState(null)
  const [cameraOn, setCameraOn] = useState(true)
  const [micOn, setMicOn] = useState(true)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [chatMessage, setChatMessage] = useState('')
  const currentUserVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const peerInstance = useRef(null)

  useEffect(() => {
    const peer = new Peer();
  
    peer.on('open', (id) => {
      setPeerId(id);
      socket.emit('register-peer', id);
    });
  
    peer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
  
        call.answer(mediaStream);
  
        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      }).catch(error => {
        console.error("Error accessing media devices.", error);
      });
    });
  
    peerInstance.current = peer;
  }, []);
  
  const call = (remotePeerId) => {
    setRemotePeerId(remotePeerId)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();
  
      const call = peerInstance.current.call(remotePeerId, mediaStream);
  
      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    }).catch(error => {
      console.error("Error accessing media devices.", error);
    });
  };
  

  const sendMessage = () => {
    const message = { userId: peerId, text: chatMessage, to: remoteCallIdValue };
    socket.emit('send-message', message);
    setMessages((prevMessages) => [...prevMessages, message]);
    setChatMessage('');
  };
  
  useEffect(() => {
    socket.on('receive-message', (message) => {
      if (message.to === peerId || message.userId === peerId) {
        // Exibe a mensagem apenas se for destinada ao usuário atual
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });
  }, []);

  const handleMic = () => {
    const stream = currentUserVideoRef.current.srcObject;

    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicOn(audioTrack.enabled);
      }
    }
  }

  const handleCamera = () => {
    const stream = currentUserVideoRef.current.srcObject;

    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCameraOn(videoTrack.enabled);
      }
    }
  }

  return (
    <MainContainer>
      <CallInputContainer>
        <Column>
          <CallLabel>Informe o id que deseja chamar:</CallLabel>
          <Row>
            <CallInput value={remoteCallIdValue} onChange={(e) => setRemoteCallIdValue(e.target.value)} />
            <CallButton onClick={() => call(remoteCallIdValue)}>Call</CallButton>
          </Row>
        </Column>
      </CallInputContainer>
      <VideoGrid>
        {currentUserVideoRef && (
          <VideoCard>
            <h3>Meu ID: {peerId}</h3>
            <video ref={currentUserVideoRef} />
            <IconContainer>
              <IconBackground onClick={handleCamera}>
                {cameraOn ? (
                  <Videocam />
                ): (
                  <VideocamOffIcon />
                )}
              </IconBackground>
              <IconBackground onClick={handleMic}>
                {micOn ? (
                  <MicIcon />
                ) : (
                  <MicOffIcon />
                )}
              </IconBackground>
            </IconContainer>
          </VideoCard>
        )}
        {remoteVideoRef && (
          <VideoCard>
            <h3>Usuário {remotePeerId}</h3>
            <video ref={remoteVideoRef} />
          </VideoCard>
        )}
      </VideoGrid>

      {currentUserVideoRef.current && remoteVideoRef.current && (
        <>
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
            {isChatOpen ? 'Fechar Chat ->' : '<- Abrir Chat'}
          </ChatButton>
        </>
      )}
    </MainContainer>
  )
}

export default App
