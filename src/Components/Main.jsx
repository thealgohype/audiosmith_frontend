import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import { FaRegStopCircle } from "react-icons/fa";
import "../styles/Components.css";
import { Sidebar } from "./Sidebar";
import openbook from "../heroimages/openbook.svg";
import arrowcirclebrokenright from "../heroimages/arrow-circle-broken-right.svg";
import tool from "../heroimages/tool-01.svg";
import microphone from "../heroimages/microphone-01.svg";
import { AppContext } from "./AppProvider";
import { PiBroom } from "react-icons/pi";
import { data } from "../utilis/data";
import { handlePresetSend, isSendDisabled } from "../utilis/handleLemonfoxSpeech";
import { createStartSpeechRecognition } from "../utilis/startSpeechrecogination";
import { createStopSpeaking } from "../utilis/stopSpeaking";
import { createHandleSend } from "../utilis/handleSend";
import { createFetchData } from "../utilis/fetchDataa";
import { RagResponse } from "./RagResponse";

export const Main = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [LLM, setModel] = useState("gpt-3.5-turbo");
  const [inputText, setInputText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [userName, setUserName] = useState("You have to logged in first");
  const [currentAudio, setCurrentAudio] = useState(null);
  const [useWebSpeechAPI, setUseWebSpeechAPI] = useState(false);
  const [handleSend, setHandleSend] = useState(() => () => {});
  const [startSpeechRecognition, setStartSpeechRecognition] = useState(() => () => {});
  const [stopSpeaking, setStopSpeaking] = useState(() => () => {}); 
  const { useAlternativeUI } = useContext(AppContext);

  const beepAudioRef = useRef(new Audio(`${process.env.REACT_APP_AUDIO_URL}`));
  const beepAudioRef2 = useRef(new Audio(`${process.env.REACT_APP_AUDIO_URL}`));
  const speechRecognitionRef = useRef(null);
  const chatEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [localData, setLocalData] = useState({ name: "" });
  const { selectedItem } = useContext(AppContext);
  const [aires, setAires] = useState([]);

  // console.log("process.env.AUDIO_URL",process.env.REACT_APP_AUDIO_URL)


  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("user_info")) || { name: "" };
    setLocalData(storedData);
  }, []);
  const fetchData = useCallback(createFetchData(localData, selectedItem, setAires), [localData, selectedItem, setAires]);
  
  useEffect(() => {
    fetchData();
    setUserName(localData.name);
  }, [fetchData, localData.name]); 

  useEffect(() => {
    chatEndRef.current?.scrollIntoView();
  }, [chatHistory]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setUseWebSpeechAPI(true);
    }
  }, []);


  const clearChatHistory = () => {
    setChatHistory([]);
    setChatStarted(false);
  };

  const startNewChat = () => {
    setChatHistory([]);
    setAires([]);
    setChatStarted(false);
  };


  const playBeep = useCallback(() => {
    beepAudioRef.current.play();
  }, []);

  const addToChat = useCallback((message, type) => {
    if (
      type === "question" &&
      chatHistory.length > 0 &&
      chatHistory[chatHistory.length - 1].text === message
    ) {
      return;
    }
    setChatHistory((prevHistory) => [...prevHistory, { text: message, type }]);
    if (!chatStarted) setChatStarted(true);
  }, [chatHistory, chatStarted, setChatStarted]);

  useEffect(() => {
    const stopSpeakingFunc = createStopSpeaking(
      speechRecognitionRef,
      mediaRecorderRef,
      currentAudio,
      setCurrentAudio,
      setIsListening,
      setShowAnimation
    );

    const startSpeechRecognitionFunc = createStartSpeechRecognition(
      useWebSpeechAPI,
      stopSpeakingFunc,
      playBeep,
      setTranscription,
      handleSend,
      setIsListening,
      mediaRecorderRef,
      speechRecognitionRef,
      inputText
    );

    const handleSendFunc = createHandleSend(
      playBeep,
      addToChat,
      setInputText,
      LLM,
      localData,
      beepAudioRef2,
      setCurrentAudio,
      setShowAnimation,
      startSpeechRecognitionFunc,
      setIsListening,
      speechRecognitionRef
    );

    setStartSpeechRecognition(() => startSpeechRecognitionFunc);
    setHandleSend(() => handleSendFunc);
    setStopSpeaking(() => stopSpeakingFunc);
  }, [useWebSpeechAPI, playBeep, setTranscription, setIsListening, inputText, LLM, localData, addToChat, currentAudio]);

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

 

  if (useAlternativeUI) {
    return <RagResponse />;
  }

  return (
    <>
      <Sidebar startNewChat={startNewChat} />
      <div className="main-container">
        <h1 className="user-name">Hello {userName}</h1>
       
        {!chatStarted && aires.length === 0 && (
          <div className="inbuilt-prompt">
            {data.map((item, index) => (
              <div key={index} className="inbuilt-prompt-div">
                <div className="book-icon-div">
                  <img
                    className="openbook-icn"
                    src={openbook}
                    alt="openbook_image"
                  />
                </div>
                <p className="book-story">{item.title}</p>
                <p className="book-story-para">{item.description}</p>
                <button>
                <img
                  className="arrowcirclebrokenright"
                  src={arrowcirclebrokenright}
                  alt="arrowcirclebrokenright_image"
                  onClick={() => handlePresetSend(item.description,handleSend)}
                />
                </button>
              </div>
            ))}
          </div>
        )}

        {aires.length > 0 && (
          <div className="chat-container">
            {aires.map((aire, index) => (
              <div key={index}>
                <div className="input-query" style={{ display: "flex", backgroundColor: "#424242", justifyContent:"flex-end", width:"70%"}}>
                  <p>{aire.val4}</p>
                </div>
                <div className="chat-response" style={{ backgroundColor: "#242424"  }}>
                  <p>{aire.val5}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {chatStarted && aires.length === 0 && (
          <div className="chat-container">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={
                  chat.type === "question" ? "input-query" : "chat-response"
                }
                style={{
                  backgroundColor:
                    chat.type === "question" ? "#424242" : "#242424",
                }}
              >
                <p>{chat.text}</p>
              </div>
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
          />
          <div className="icons-container">
            <button className="input-icon" onClick={clearChatHistory}>
            <PiBroom style={{color:"#E9CA91" , width:"20px",height:"20px"}}/>
            </button>
            <div className="dropdown-container">
              <img
                src={tool}
                alt="Tool"
                className="input-icon"
                onClick={() => setShowDropdown(!showDropdown)}
              />
              {showDropdown && (
                <div className="dropdown">
                  <select
                    value={LLM}
                    onChange={(e) => setModel(e.target.value)}
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5-turbo</option>
                    <option value="gpt-4o">GPT-4</option>
                    <option value="claude-sonnet">Claude-sonne</option>
                    <option value="claude-opus">Claude-opus</option>
                    <option value="google-gemini">Gemini</option>
                    <option value="llama3-groq">LlAMA-3-groq</option>
                  </select>
                </div>
              )}
            </div>
            {!showAnimation && (
              <img
                src={microphone}
                alt="Microphone"
                className="input-icon"
                onClick={startSpeechRecognition}
              />
            )}
            {showAnimation && (
              <button onClick={stopSpeaking} className="stop-button">
                <FaRegStopCircle style={{color:"#E9CA91", width:"20px",height:"20px"}}/>
              </button>
            )}
          </div>
          <img
        src="https://ai-agents18.s3.ap-south-1.amazonaws.com/audiosmith-sendbtn.jpg"
        alt="Send"
        className={`send-icon ${isSendDisabled(inputText) ? 'disabled' : ''}`}
        onClick={handleSendButtonClick}
        style={{ cursor: isSendDisabled(inputText) ? 'not-allowed' : 'pointer', opacity: isSendDisabled ? 0.5 : 1 }}
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
      </div>
    </>
  );
};
