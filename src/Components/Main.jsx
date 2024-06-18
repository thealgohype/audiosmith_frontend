import React, { useState, useRef, useEffect, useContext } from "react";
import {
  FaRegStopCircle,
  FaPaperPlane,
  FaTrash,
  FaStop,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import "../styles/Components.css";
import { Sidebar } from "./Sidebar";
import openbook from "../heroimages/openbook.svg";
import arrowcirclebrokenright from "../heroimages/arrow-circle-broken-right.svg";
import ellipse from "../heroimages/Ellipse 93.svg";
import tool from "../heroimages/tool-01.svg";
import microphone from "../heroimages/microphone-01.svg";
import axios from 'axios';
import { AppContext } from "./AppProvider";
import { PiBroom } from "react-icons/pi";

export const Main = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [LLM, setModel] = useState("gpt-3.5-turbo");
  const [inputText, setInputText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const beepAudioRef = useRef(
    new Audio(
      "https://file.notion.so/f/f/d63da4d3-2abc-444e-8eab-6e3acc166743/1b0e0826-4588-4fd4-83ac-bcca2fbb6c28/clickti_-_3.mp3?id=87b35fc2-1d96-4eef-9b23-db2cc6e72fb1&table=block&spaceId=d63da4d3-2abc-444e-8eab-6e3acc166743&expirationTimestamp=1718193600000&signature=45Zz7pKU1cElOlgVrRpiuH4qwPtfEYUW9xRV4mSzMvI"
    )
  );
  const beepAudioRef2 = useRef(
    new Audio(
      "https://file.notion.so/f/f/d63da4d3-2abc-444e-8eab-6e3acc166743/1b0e0826-4588-4fd4-83ac-bcca2fbb6c28/clickti_-_3.mp3?id=87b35fc2-1d96-4eef-9b23-db2cc6e72fb1&table=block&spaceId=d63da4d3-2abc-444e-8eab-6e3acc166743&expirationTimestamp=1718193600000&signature=45Zz7pKU1cElOlgVrRpiuH4qwPtfEYUW9xRV4mSzMvI"
    )
  );
  const speechRecognitionRef = useRef(null);
  const chatEndRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const { selectedItem } = useContext(AppContext);
  const [aires, setAires] = useState([]);
  const [userName, setUserName] = useState("You have to logged in first");
  const [currentAudio, setCurrentAudio] = useState(null);
  const [useWebSpeechAPI, setUseWebSpeechAPI] = useState(false);
  const mediaRecorderRef = useRef(null);

  let localData = JSON.parse(localStorage.getItem("user_info")) || { name: "" }

  const fetchData = () => {
    const postData = {
      userEmail : localData.hd || ""
    }
    axios
    .post(`${process.env.chatproBackedGet}`,postData)
    .then((response) => {
      let obj = response.data.grouped_data;
        for (let k in obj) {
          if (selectedItem === k) {
            setAires(obj[k]);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData();
    setUserName(localData.name)
  }, [selectedItem]); 

  useEffect(() => {
    chatEndRef.current?.scrollIntoView();
  }, [chatHistory]);

  useEffect(() => {
    // Check if the browser supports the Web Speech API
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setUseWebSpeechAPI(true);
    }
  }, []);

  const playBeep = () => {
    beepAudioRef.current.play();
  };

  const addToChat = (message, type) => {
    if (
      type === "question" &&
      chatHistory.length > 0 &&
      chatHistory[chatHistory.length - 1].text === message
    ) {
      return;
    }
    setChatHistory((chatHistory) => [...chatHistory, { text: message, type }]);
    if (!chatStarted) setChatStarted(true);
  };

  const clearChatHistory = () => {
    setChatHistory([]);
    setChatStarted(false);
  };

  const startNewChat = () => {
    setChatHistory([]);
    setAires([]);
    setChatStarted(false);
  };

  const startSpeechRecognition = () => {
    if (useWebSpeechAPI) {
      // Use Web Speech API
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript
          .trim()
          .toLowerCase();
        if (transcript.includes("stop")) {
          stopSpeaking();
          return;
        }
        if (event.results[event.results.length - 1].isFinal) {
          playBeep();
          setTranscription(transcript);
          handleSend(transcript, true);
        }
      };

      recognition.onspeechend = () => {
        recognition.stop();
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        // Fallback to LemonFox API
        handleLemonFoxSpeechRecognition();
      };

      recognition.start();
      speechRecognitionRef.current = recognition;
      setIsListening(true);
    } else {
      // Use LemonFox API
      handleLemonFoxSpeechRecognition();
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      speechRecognitionRef.current = null;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    setIsListening(false);
    setShowAnimation(false);
  };

  const handleSend = (text = inputText, isSpeech = false) => {
    playBeep();
    addToChat(text, "question");
    setInputText("");
    const payload = {
      text: text,
      LLM: LLM,
      userEmail : localData.hd || ""
    };

    fetch(`${process.env.chatproBackendAdd}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        beepAudioRef2.current.play();
        const answer = data.data[3];
        addToChat(answer, "answer");

        if (isSpeech) {
          const audioSrc = `data:audio/wav;base64,${data.audio_content}`;
          const audio = new Audio(audioSrc);
          setCurrentAudio(audio);
          audio.play();

          setShowAnimation(true);
          audio.onended = () => {
            setShowAnimation(false);
            setCurrentAudio(null);
            startSpeechRecognition();
          };
        }
      })
      .catch((error) => {
        console.error("Error with the send function:", error);
      });
  };


  const handleLemonFoxSpeechRecognition = () => {
    const startRecording = () => {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          let chunks = [];

          mediaRecorder.ondataavailable = event => {
            chunks.push(event.data);
          };

          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { 'type': 'audio/wav' });
            const body = new FormData();
            body.append('file', blob);
            body.append('language', 'english');
            body.append('response_format', 'json');

            fetch('https://api.lemonfox.ai/v1/audio/transcriptions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.AuthTokenlemonfox}` 
              },
              body: body
            })
            .then(response => response.json())
            .then(data => {
              const text = data['text'];
              if (text.toLowerCase().includes("stop")) {
                stopSpeaking();
                return;
              }
              setTranscription(text);
              handleSend(text, true);
            })
            .catch(error => {
              console.error('Error:', error);
            });
          };

          mediaRecorder.start();
          setIsListening(true);
        })
        .catch(error => {
          console.error('Error accessing microphone:', error);
        });
    };

    startRecording();
  };

  const data = [
    {
      title: "Story",
      description:
        "Generate a story from the given prompt. Generate a story from the given prompt.Generate a story from the given prompt.",
    },
    {
      title: "Adventure",
      description:
        "Create an adventure story based on your input. Create an adventure story based on your input.",
    },
    {
      title: "Adventure",
      description:
        "Create an adventure story Ai.",
    },
  ];
  const isSendDisabled = inputText.trim() === '';
  const handlePresetSend = (description) => {
    handleSend(description);
  };

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
                  onClick={() => handlePresetSend(item.description)}
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
            onKeyPress={(e) => {
          if (e.key === 'Enter' && !isSendDisabled) {
            handleSend();
          }
        }}
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
                    <option value="gpt-4">GPT-4</option>
                    <option value="claude-sonneT">Claude-sonne</option>
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
        src="https://s3-alpha-sig.figma.com/img/9ad7/2d2d/649a3f001361586c198c4722816c0ea8?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=N0cvCWBEysZodVxR1eQDUU04z2RMQ6Nx66fcvFBg27H7VPH4FewULfxca~9UMCPCOwrGg6i3BYhHYrQ2FEV0jkXs8M~f66H7DgTfQXqbUzfCi8p33rCLlG~SZtHXtDIWcgax~nqACJdAoygGA0tqJryxEcNVVzLontMfaKRg2ENnsz4A64hSUQ-XcKD78~HViKRG5s54-cwDKQ1BvWhS3AOUSAxW0K7b-GkS~yFiHsq44thbqJhW~WXYIlZchMvaZn40fRBc4mJpAqS2cXn3VCMTZ7mq5913KZgO5OLxIg6uxNpxqjB0-s1A7qzodHllJ9KOmDiCSv3fcLPwtfIaIQ__"
        alt="Send"
        className={`send-icon ${isSendDisabled ? 'disabled' : ''}`}
        onClick={() => {
          if (!isSendDisabled) handleSend(inputText);
        }}
        style={{ cursor: isSendDisabled ? 'not-allowed' : 'pointer', opacity: isSendDisabled ? 0.5 : 1 }}
      />
        </div>

        {isListening && (
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
