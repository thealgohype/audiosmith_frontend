export const handleLemonFoxSpeechRecognition = (mediaRecorderRef, stopSpeaking, setTranscription, handleSend, setIsListening, inputText) => {
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
  
            fetch(`${process.env.REACT_APP_URL_LEMONFOX}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_AUTH_TOKEN_LEMONFOX}` 
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
  
  export const isSendDisabled = (inputText) => inputText.trim() === '';
  
  export const handlePresetSend = (description, handleSend) => {
    handleSend(description);
  };