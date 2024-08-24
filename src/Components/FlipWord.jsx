import React, { useState, useEffect } from 'react';

const FlipWords = ({ words }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsFlipping(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [words]);

  const handleClick = () => {
    if (!isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsFlipping(false);
      }, 500);
    }
  };

  return (
    <span className="flip-word-wrapper" onClick={handleClick}>
      <span className={`flip-word ${isFlipping ? 'flipping' : ''}`}>
        {words[currentIndex]}
      </span>
    </span>
  );
};

const FlipWordsComp = () => {
  const words = ["LangChain", "Github-repo", "Bravesearch", "user-friendly"];

  return (
    <div className="flip-words-container">
      <div className="chat-message">
        <div className="assistant-response">
          <h1 className="text-4xl font-bold mb-6">
            Chat with <FlipWords words={words} /> & more.
          </h1>
          <p className="text-xl mb-8 leading-relaxed">
            Enhance your productivity: connect with LangChain, GitHub, and explore even more advanced features.
          </p>
        </div>
      </div>
      <style jsx>{`
        .flip-words-container {
          padding-left: 200px; 
          padding-top: 100px; 
        }
        .chat-message {
          width: 100%;
          max-width: 800px;
        }
        .assistant-response {
          background-color: rgba(255, 255, 255, 0.05);
          color: #FFFFFF;
          padding: 48px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        h1 {
          color: #F0F0F0;
          line-height: 1.2;
        }
        p {
          color: #CCCCCC;
        }
        .flip-word-wrapper {
          display: inline-block;
          perspective: 1000px;
        }
        .flip-word {
          display: inline-block;
          color: #E9CA91;
          transition: transform 0.6s;
          transform-style: preserve-3d;
          min-width: 150px;
        }
        .flip-word.flipping {
          transform: rotateX(360deg);
        }
      `}</style>
    </div>
  );
};

export default FlipWordsComp;









// import React, { useState, useEffect } from 'react';

// const FlipWords = ({ words }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isFlipping, setIsFlipping] = useState(false);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIsFlipping(true);
//       setTimeout(() => {
//         setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
//         setIsFlipping(false);
//       }, 500);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [words]);

//   const handleClick = () => {
//     if (!isFlipping) {
//       setIsFlipping(true);
//       setTimeout(() => {
//         setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
//         setIsFlipping(false);
//       }, 500);
//     }
//   };

//   return (
//     <span className="flip-word-wrapper" onClick={handleClick}>
//       <span className={`flip-word ${isFlipping ? 'flipping' : ''}`}>
//         {words[currentIndex]}
//       </span>
//     </span>
//   );
// };

// const FlipWordsComp = () => {
//   const words = ["LangChain", "Github-repo", "Bravesearch", "user-friendly"];

//   return (
//     <div className="flip-words-container">
//       <div className="chat-message">
//         <div className="assistant-response">
//           <h1 className="text-4xl font-bold mb-6">
//             Chat with <FlipWords words={words} /> & more.
//           </h1>
//           <p className="text-xl mb-8 leading-relaxed">
//           Enhance your productivity: connect with LangChain, GitHub, and explore even more advanced features.
//           </p>
//         </div>
//       </div>
//       <style jsx global>{`
//         .flip-words-container {
//           padding-left: 200px; 
//           padding-top: 100px; 
//         }
//         .chat-message {
//           width: 100%;
//           max-width: 800px;
//         }
//         .assistant-response {
//           background-color: rgba(255, 255, 255, 0.05);
//           color: #FFFFFF;
//           padding: 48px;
//           border-radius: 20px;
//           text-align: center;
//           box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
//           backdrop-filter: blur(4px);
//           -webkit-backdrop-filter: blur(4px);
//           border: 1px solid rgba(255, 255, 255, 0.18);
//         }
//         h1 {
//           color: #F0F0F0;
//           line-height: 1.2;
//         }
//         p {
//           color: #CCCCCC;
//         }
//         .flip-word-wrapper {
//           display: inline-block;
//           perspective: 1000px;
//         }
//         .flip-word {
//           display: inline-block;
//           color: #E9CA91;
//           transition: transform 0.6s;
//           transform-style: preserve-3d;
//           min-width: 150px;
//         }
//         .flip-word.flipping {
//           transform: rotateX(360deg);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default FlipWordsComp;