export const createHandleSend = (
    playBeep,
    addToChat,
    setInputText,
    LLM,
    localData,
    beepAudioRef2,
    setCurrentAudio,
    setShowAnimation,
    startSpeechRecognition
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
  };