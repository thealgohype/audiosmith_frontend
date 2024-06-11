// import React, { useState, useRef } from 'react';
// import axios from 'axios';

// const OpenAITest = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [apiKey, setApiKey] = useState('');
//   const mediaRecorderRef = useRef(null);
//   const [audioChunks, setAudioChunks] = useState([]);

//   const handleStartRecording = () => {
//     navigator.mediaDevices.getUserMedia({ audio: true })
//       .then(stream => {
//         const mediaRecorder = new MediaRecorder(stream);
//         mediaRecorderRef.current = mediaRecorder;
//         mediaRecorder.ondataavailable = event => {
//           setAudioChunks(prevChunks => [...prevChunks, event.data]);
//         };
//         mediaRecorder.onstop = handleStopRecording;
//         mediaRecorder.start();
//         setIsRecording(true);
//       })
//       .catch(error => {
//         console.error('Error accessing microphone:', error);
//       });
//   };

//   const handleStopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   const handleSendToOpenAI = async () => {
//     const blob = new Blob(audioChunks, { type: 'audio/wav' });
//     const formData = new FormData();
//     formData.append('file', blob, 'audio.wav');
//     formData.append('model', 'whisper-1');

//     try {
//       const response = await axios.post('https://api.lemonfox.ai/v1/audio/transcriptions', formData, {
//         headers: {
//           'Authorization': `Bearer ${apiKey}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       console.log(response.data.text);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const handleButtonClick = () => {
//     if (isRecording) {
//       handleStopRecording();
//       setTimeout(handleSendToOpenAI, 500); // Give time for recording to stop
//     } else {
//       setAudioChunks([]); // Clear previous recordings
//       handleStartRecording();
//     }
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Enter OpenAI API Key"
//         value={apiKey}
//         onChange={(e) => setApiKey(e.target.value)}
//         style={{ marginBottom: '10px', width: '300px' }}
//       />
//       <br />
//       <button onClick={handleButtonClick}>
//         {isRecording ? 'Stop Recording' : 'Start Recording'}
//       </button>
//     </div>
//   );
// };

// export default OpenAITest;


import React, { useState } from 'react';
import axios from 'axios';

const SpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];

        mediaRecorder.addEventListener('dataavailable', (event) => {
          chunks.push(event.data);
        });

        mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(chunks, { type: 'audio/wav' });
          sendAudioToLemonfox(audioBlob);
        });

        mediaRecorder.start();
        setIsRecording(true);
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });
  };

  const stopRecording = () => {
    setIsRecording(false);
    const mediaStream = navigator.mediaDevices.getDisplayMedia();
    const tracks = mediaStream.getTracks();
    tracks.forEach((track) => track.stop());
  };

  const sendAudioToLemonfox = (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    axios.post('https://api.lemonfox.ai/v1/speech-to-text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer neFzSFnBDP21zUxsTWw6pxnfOwslUQV5',
      },
    })
      .then((response) => {
        setTranscript(response.data.transcript);
      })
      .catch((error) => {
        console.error('Error sending audio to Lemonfox:', error);
      });
  };

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <p>Transcribed Text: {transcript}</p>
    </div>
  );
};

export default SpeechToText;
