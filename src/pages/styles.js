import styled from 'styled-components';

// Estilo básico
export const MainContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #202124;
  color: white;
`;

export const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
`;

export const VideoCard = styled.div`
  background-color: #303134;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  video {
    width: 100%;
    height: auto;
    border-radius: 10px;
  }
`;

export const ChatSidebar = styled.div`
  background-color: #3c4043;
  width: ${(props) => (props.isOpen ? '300px' : '0')};
  overflow: hidden;
  transition: width 0.3s ease-in-out;
  height: 100%;
  position: relative;
`;

export const ChatButton = styled.button`
  position: absolute;
  top: 20px;
  right: ${(props) => (props.isOpen ? '310px' : '10px')};
  background-color: #1a73e8;
  border: none;
  color: white;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: right 0.3s ease-in-out;
`;

export const ChatContainer = styled.div`
  padding: 20px;
  color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
`;

export const ChatInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: none;
`;