/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import Peer from "peerjs"
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

const socket = io.connect('http://localhost:5000')

function App() {
  const [me] = useState(`User-${Math.random()}`)
  const [stream, setStream] = useState()
  const [users, setUsers] = useState({})
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [chatMessage, setChatMessage] = useState('')
  const myVideo = useRef()
  const peersRef = useRef({})

  const roomId = "1234" // Pode ser gerado dinamicamente ou solicitado ao usuário.

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream)
      myVideo.current.srcObject = stream

      socket.emit("join-room", roomId, socket.id)

      socket.on("user-connected", (userId) => {
        connectToNewUser(userId, stream)
      })

      socket.on("user-disconnected", (userId) => {
        if (peersRef.current[userId]) peersRef.current[userId].destroy()
        setUsers((prevUsers) => {
          const updatedUsers = { ...prevUsers }
          delete updatedUsers[userId]
          return updatedUsers
        })
      })
    })
  }, [])

  const connectToNewUser = (userId, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    })

    peer.on("signal", (signal) => {
      socket.emit("callUser", {
        userToCall: userId,
        signalData: signal,
        from: me
      })
    })

    peer.on("stream", (userStream) => {
      setUsers((prevUsers) => ({
        ...prevUsers,
        [userId]: userStream
      }))
    })

    peersRef.current[userId] = peer
  }

  const sendMessage = () => {
    const message = { userId: me, text: chatMessage };
    socket.emit('send-message', message);
    setChatMessage('');
  };
  
  useEffect(() => {
    socket.on('receive-message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);
  

  return (
    <MainContainer>
      <VideoGrid>
        <VideoCard>
          {stream && <video playsInline muted ref={myVideo} autoPlay />}
        </VideoCard>
        {Object.values(users).map((userStream, index) => (
          <VideoCard key={index}>
            <video playsInline ref={(ref) => ref && (ref.srcObject = userStream)} autoPlay />
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
  )
}

export default App
