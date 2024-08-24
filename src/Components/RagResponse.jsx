import React, { useState, useRef, useEffect, useContext } from 'react';
import { Sidebar } from './Sidebar';
import { AppContext } from './AppProvider';
import { PiBroom } from 'react-icons/pi';
import { FaRegStopCircle } from "react-icons/fa";
import { handlePresetSend, isSendDisabled } from '../utilis/handleLemonfoxSpeech';
import { createStartSpeechRecognition } from "../utilis/startSpeechrecogination";
import { createStopSpeaking } from "../utilis/stopSpeaking";
import microphone from "../heroimages/microphone-01.svg";
import "../styles/Ragresponse.css"
import { ChatResponseRagres } from './ChatReponseRagres';
import FlipWordsComp from './FlipWord';

export const RagResponse = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [inputText, setInputText] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [userName, setUserName] = useState('You have to logged in first');
  const [isListening, setIsListening] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const chatEndRef = useRef(null);
  const { selectedItem } = useContext(AppContext);
  const beepAudioRef = useRef(new Audio(`${process.env.REACT_APP_AUDIO_URL}`));
  const speechRecognitionRef = useRef(null);

  const [localData, setLocalData] = useState({ name: '' });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('user_info')) || { name: '' };
    setLocalData(storedData);
    setUserName(storedData.name);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const clearChatHistory = () => {
    setChatHistory([]);
    setChatStarted(false);
  };

  const startNewChat = () => {
    setChatHistory([]);
    setChatStarted(false);
  };

  const addToChat = (message, type, documents = []) => {
    setChatHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      if (type === 'response' && newHistory.length > 0 && newHistory[newHistory.length - 1].type === 'response') {
        // Update the last response
        newHistory[newHistory.length - 1] = { text: message, type, documents };
      } else {
        // Add a new message
        newHistory.push({ text: message, type, documents });
      }
      return newHistory;
    });
    if (!chatStarted) setChatStarted(true);
  };

  const handleRagResponse = async (query) => {
    let currentDocuments = [];
    setIsStreaming(true);
  
    // Add user query to chat history immediately
    addToChat(query, 'query');
  
    // Add an initial empty response to the chat history
    addToChat('', 'response');
  
    try {
      const response = await fetch(process.env.REACT_APP_AGENTIC_RAG_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
  
      let partialChunk = '';
      let concatenatedResponse = '';
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        const chunk = decoder.decode(value, { stream: true });
        partialChunk += chunk;
  
        const lines = partialChunk.split('\n');
  
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
  
          if (line === 'data: [DONE]') {
            setIsStreaming(false);
            break;
          }
  
          if (line.startsWith('data: ')) {
            const jsonData = line.slice(6); // Remove "data: " prefix
            try {
              const parsedData = JSON.parse(jsonData);
              console.log("Received data:", parsedData);
  
              if (parsedData && parsedData.type === 'generation') {
                concatenatedResponse += parsedData.content;
                addToChat(concatenatedResponse.trim(), 'response', currentDocuments);
              } else if (parsedData && parsedData.type === 'metadata') {
                // Handle metadata
                currentDocuments = parsedData.content.documents
                  .filter(doc => doc.metadata && doc.metadata.source)
                  .map(doc => ({
                    title: doc.metadata.title || 'Untitled',
                    url: doc.metadata.source
                  }));
                // Update the chat with the new documents
                addToChat(concatenatedResponse.trim(), 'response', currentDocuments);
              } else {
                console.warn("Unexpected data structure:", parsedData);
              }
            } catch (e) {
              console.error('Error parsing JSON:', e);
              console.warn("Received non-JSON data:", line);
            }
          }
        }
  
        partialChunk = lines[lines.length - 1];
      }
  
    } catch (error) {
      console.error('Error fetching RAG response:', error);
      addToChat('Sorry, there was an error processing your request.', 'response');
    } finally {
      setIsStreaming(false);
    }
  };
  

  const handleSend = (text) => {
    setInputText('');
    handleRagResponse(text);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter' && !isSendDisabled(inputText)) {
      handleSend(inputText);
    }
  };

  const handleSendButtonClick = () => {
    if (!isSendDisabled(inputText)) {
      handleSend(inputText);
    }
  };

  const playBeep = () => {
    beepAudioRef.current.play();
  };

  const stopSpeaking = createStopSpeaking(
    speechRecognitionRef,
    null,
    currentAudio,
    setCurrentAudio,
    setIsListening,
    setShowAnimation
  );

  const startSpeechRecognition = createStartSpeechRecognition(
    true,
    stopSpeaking,
    playBeep,
    setInputText,
    handleSend,
    setIsListening,
    null,
    speechRecognitionRef,
    inputText
  );

  return (
    <>
      <Sidebar startNewChat={startNewChat} />
      <div className="main-container">
        <h1 className="user-name">Hello {userName}</h1>

        {!chatStarted ? (
          <div className="flip-word-container">
            <FlipWordsComp />
          </div>
        ) : (
          <div className="chat-container">
        {chatHistory.map((chat, index) => (
          <ChatResponseRagres key={index} chat={chat} documents={chat.documents || []} />
        ))}
        <div ref={chatEndRef} />
      </div>
        )}

        <div className="input-wrapper">
          <input
            className="input-box"
            type="text"
            placeholder="Type here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleInputKeyPress}
            disabled={isStreaming}
          />
          <div className="icons-container">
            <button className="input-icon" onClick={clearChatHistory} disabled={isStreaming}>
              <PiBroom />
            </button>
            {!showAnimation ? (
              <img
                src={microphone}
                alt="Microphone"
                className="input-icon"
                onClick={startSpeechRecognition}
                style={{ opacity: isStreaming ? 0.5 : 1, pointerEvents: isStreaming ? 'none' : 'auto' }}
              />
            ) : (
              <button onClick={stopSpeaking} className="stop-button" disabled={isStreaming}>
                <FaRegStopCircle />
              </button>
            )}
          </div>
          <img
            src="https://ai-agents18.s3.ap-south-1.amazonaws.com/audiosmith-sendbtn.jpg"
            alt="Send"
            className={`send-icon ${isSendDisabled(inputText) || isStreaming ? 'disabled' : ''}`}
            onClick={handleSendButtonClick}
            style={{ opacity: isStreaming ? 0.5 : 1, pointerEvents: isStreaming ? 'none' : 'auto' }}
          />
        </div>

        {isListening && !showAnimation && (
          <div className="listening-animation">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}

        {showAnimation && (
          <div className="speaking-animation">
            <div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}

        {/* {isStreaming && (
          <div className="streaming-indicator">
            Receiving response...
          </div>
        )} */}
      </div>
      <style jsx>{`
        .flip-word-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: calc(100vh - 200px);
        }
        .streaming-indicator {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 10px 20px;
          border-radius: 20px;
          font-size: 14px;
        }
      `}</style>
    </>
  );
};
























// import React, { useState, useRef, useEffect, useContext } from 'react';
// import { Sidebar } from './Sidebar';
// import { AppContext } from './AppProvider';
// import { PiBroom } from 'react-icons/pi';
// import { FaRegStopCircle } from "react-icons/fa";
// import { handlePresetSend, isSendDisabled } from '../utilis/handleLemonfoxSpeech';
// import { createStartSpeechRecognition } from "../utilis/startSpeechrecogination";
// import { createStopSpeaking } from "../utilis/stopSpeaking";
// import microphone from "../heroimages/microphone-01.svg";
// import axios from 'axios';
// import "../styles/Ragresponse.css"
// import { ChatResponseRagres } from './ChatReponseRagres';
// import FlipWordsComp from './FlipWord';

// export const RagResponse = () => {
//   const [chatHistory, setChatHistory] = useState([]);
//   const [inputText, setInputText] = useState('');
//   const [chatStarted, setChatStarted] = useState(false);
//   const [userName, setUserName] = useState('You have to logged in first');
//   const [isListening, setIsListening] = useState(false);
//   const [showAnimation, setShowAnimation] = useState(false);
//   const [currentAudio, setCurrentAudio] = useState(null);

//   const chatEndRef = useRef(null);
//   const { selectedItem } = useContext(AppContext);
//   const beepAudioRef = useRef(new Audio(`${process.env.REACT_APP_AUDIO_URL}`));
//   const speechRecognitionRef = useRef(null);

//   const [localData, setLocalData] = useState({ name: '' });

//   useEffect(() => {
//     const storedData = JSON.parse(localStorage.getItem('user_info')) || { name: '' };
//     setLocalData(storedData);
//     setUserName(storedData.name);
//   }, []);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [chatHistory]);

//   const clearChatHistory = () => {
//     setChatHistory([]);
//     setChatStarted(false);
//   };

//   const startNewChat = () => {
//     setChatHistory([]);
//     setChatStarted(false);
//   };

//   const addToChat = (message, type, documents = []) => {
//     if (
//       type === 'question' &&
//       chatHistory.length > 0 &&
//       chatHistory[chatHistory.length - 1].text === message
//     ) {
//       return;
//     }
//     setChatHistory((prevHistory) => [...prevHistory, { text: message, type, documents }]);
//     if (!chatStarted) setChatStarted(true);
//   };

//   const handleRagResponse = async (query) => {
//     try {
//       const response = await axios.post(process.env.REACT_APP_AGENTIC_RAG_URL, {
//         query: query
//       });
//       console.log("response.data", response.data);
//       addToChat(response.data.data.generation, 'response', response.data.data.documents || []);
//     } catch (error) {
//       console.error('Error fetching RAG response:', error);
//       addToChat('Sorry, there was an error processing your request.', 'response');
//     }
//   };

//   const handleSend = (text) => {
//     addToChat(text, 'question');
//     setInputText('');
//     handleRagResponse(text);
//   };

//   const handleInputKeyPress = (e) => {
//     if (e.key === 'Enter' && !isSendDisabled(inputText)) {
//       handleSend(inputText);
//     }
//   };

//   const handleSendButtonClick = () => {
//     if (!isSendDisabled(inputText)) {
//       handleSend(inputText);
//     }
//   };

//   const playBeep = () => {
//     beepAudioRef.current.play();
//   };

//   const stopSpeaking = createStopSpeaking(
//     speechRecognitionRef,
//     null,
//     currentAudio,
//     setCurrentAudio,
//     setIsListening,
//     setShowAnimation
//   );

//   const startSpeechRecognition = createStartSpeechRecognition(
//     true,
//     stopSpeaking,
//     playBeep,
//     setInputText,
//     handleSend,
//     setIsListening,
//     null,
//     speechRecognitionRef,
//     inputText
//   );

//   return (
//     <>
//       <Sidebar startNewChat={startNewChat} />
//       <div className="main-container">
//         <h1 className="user-name">Hello {userName}</h1>

//         {!chatStarted ? (
//           <div className="flip-word-container">
//             <FlipWordsComp />
//           </div>
//         ) : (
//           <div className="chat-container">
//             {chatHistory.map((chat, index) => (
//               <ChatResponseRagres key={index} chat={chat} documents={chat.documents || []} />
//             ))}
//             <div ref={chatEndRef} />
//           </div>
//         )}

//         <div className="input-wrapper">
//           <input
//             className="input-box"
//             type="text"
//             placeholder="Type here..."
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//             onKeyPress={handleInputKeyPress}
//           />
//           <div className="icons-container">
//             <button className="input-icon" onClick={clearChatHistory}>
//               <PiBroom />
//             </button>
//             {!showAnimation ? (
//               <img
//                 src={microphone}
//                 alt="Microphone"
//                 className="input-icon"
//                 onClick={startSpeechRecognition}
//               />
//             ) : (
//               <button onClick={stopSpeaking} className="stop-button">
//                 <FaRegStopCircle />
//               </button>
//             )}
//           </div>
//           <img
//             src="https://ai-agents18.s3.ap-south-1.amazonaws.com/audiosmith-sendbtn.jpg"
//             alt="Send"
//             className={`send-icon ${isSendDisabled(inputText) ? 'disabled' : ''}`}
//             onClick={handleSendButtonClick}
//           />
//         </div>

//         {isListening && !showAnimation && (
//           <div className="listening-animation">
//             <div></div>
//             <div></div>
//             <div></div>
//             <div></div>
//             <div></div>
//           </div>
//         )}

//         {showAnimation && (
//           <div className="speaking-animation">
//             <div>
//               <div></div>
//               <div></div>
//               <div></div>
//             </div>
//           </div>
//         )}
//       </div>
//       <style jsx>{`
//         .flip-word-container {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           height: calc(100vh - 200px); /* Adjust as needed */
//         }
//       `}</style>
//     </>
//   );
// };