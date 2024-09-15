import styled from 'styled-components';

// Estilo básico
export const MainContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #202124;
  color: white;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
`

export const CallInputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #202124;
  width: 50%;
  height: 100vh;

  h3 {
    color: white;
  }
`;

export const CallLabel = styled.label`
  color: white;
  margin-right: 10px;
`;

export const CallInput = styled.input`
  background-color: #303134;
  color: white;
  height: 30px;
  width: 500px;
  border: none;
  border-radius: 5px;
  padding: 0 10px;
  margin-right: 10px;
`;

export const CallButton = styled.button`
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  cursor: pointer;
`;

export const VideoGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
`;

export const VideoCard = styled.div`
  background-color: #303134;
  border-radius: 10px;
  padding: 10px;
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
  position: relative;
  video {
    width: 100%;
    height: auto;
    border-radius: 10px;
    background-color: #000;
  }
`;

export const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`

export const IconBackground = styled.button`
  display: flex;
  width: 50px;
  height: 50px;
  background-color: #1a73e8;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  border-style: none;
`

export const ChatSidebar = styled.div`
  background-color: #3c4043;
  width: ${(props) => (props.isOpen ? '400px' : '0')};
  overflow: hidden;
  transition: width 0.3s ease-in-out;
  height: 100%;
  position: relative;
`;

export const ChatButton = styled.button`
  position: absolute;
  top: 20px;
  right: ${(props) => (props.isOpen ? '350px' : '10px')};
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