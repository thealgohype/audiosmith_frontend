import { handleLemonFoxSpeechRecognition } from "./handleLemonfoxSpeech";

export const createStartSpeechRecognition = (
  useWebSpeechAPI,
  stopSpeaking,
  playBeep,
  setTranscription,
  handleSend,
  setIsListening,
  mediaRecorderRef,
  speechRecognitionRef,
  inputText
) => {
  return () => {
    if (useWebSpeechAPI) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = true;
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

      recognition.onend = () => {
        // Only restart if not manually stopped
        if (speechRecognitionRef.current) {
          recognition.start();
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        handleLemonFoxSpeechRecognition(
          mediaRecorderRef,
          stopSpeaking,
          setTranscription,
          handleSend,
          setIsListening,
          inputText
        );
      };

      recognition.start();
      speechRecognitionRef.current = recognition;
      setIsListening(true);
    } else {
      handleLemonFoxSpeechRecognition(
        mediaRecorderRef,
        stopSpeaking,
        setTranscription,
        handleSend,
        setIsListening,
        inputText
      );
    }
  };
};

export const createHandleSend = (
  playBeep,
  addToChat,
  setInputText,
  LLM,
  localData,
  beepAudioRef2,
  setCurrentAudio,
  setShowAnimation,
  startSpeechRecognition,
  setIsListening,
  speechRecognitionRef
) => {
  return (text, isSpeech = false) => {
    playBeep();
    addToChat(text, "question");
    setInputText("");
    const payload = {
      text: text,
      LLM: LLM,
      userEmail: localData.hd || ""
    };

    // Stop listening while processing and speaking
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    setIsListening(false);

    fetch(`${process.env.REACT_APP_CHATPRO_BACKEND_ADD}/api/add/`, {
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
          setShowAnimation(true);
          
          audio.play();

          audio.onended = () => {
            setShowAnimation(false);
            setCurrentAudio(null);
            // Restart speech recognition after speaking is done
            startSpeechRecognition();
          };
        } else {
          // If not speech, restart listening immediately
          startSpeechRecognition();
        }
      })
      .catch((error) => {
        console.error("Error with the send function:", error);
        // Restart listening even if there's an error
        startSpeechRecognition();
      });
  };
};

export const createStopSpeaking = (
  speechRecognitionRef,
  mediaRecorderRef,
  currentAudio,
  setCurrentAudio,
  setIsListening,
  setShowAnimation
) => {
  return () => {
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
};