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