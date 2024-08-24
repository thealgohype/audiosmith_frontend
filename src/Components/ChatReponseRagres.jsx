import React, { useState } from 'react';
import { FaQuestionCircle, FaRegStopCircle, FaLink, FaInfoCircle, FaRobot } from "react-icons/fa";

const getFaviconUrl = (url) => {
  if (!url) return null;
  const domain = new URL(url).hostname;
  return `https://www.google.com/s2/favicons?domain=${domain}&size=32`;
};

const SourceIcon = ({ url }) => {
  const [iconLoaded, setIconLoaded] = useState(false);
  const faviconUrl = getFaviconUrl(url);

  if (!url) return <FaQuestionCircle />;

  return (
    <div className="w-4 h-4 flex items-center justify-center">
      {!iconLoaded && <FaLink />}
      {faviconUrl && (
        <img
          src={faviconUrl}
          alt=""
          className={`w-4 h-4 ${iconLoaded ? 'block' : 'hidden'}`}
          onLoad={() => setIconLoaded(true)}
          onError={() => setIconLoaded(false)}
        />
      )}
    </div>
  );
};

export const ChatResponseRagres = ({ chat }) => {
  return (
    <div className={`chat-message ${chat.type}`}>
      {chat.type === 'query' && (
        <div className="user-query">
          <p>{chat.text}</p>
        </div>
      )}
      {chat.type === 'response' && (
        <div className="response-container">
          {chat.documents && chat.documents.length > 0 && (
            <div className="document-sources">
              <div className="sources-header">
                <FaInfoCircle />
                <span>Sources ({chat.documents.length})</span>
              </div>
              <div className="sources-list">
                {chat.documents.map((doc, index) => (
                  <a
                    key={index}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="document-source"
                    title={doc.url}
                  >
                    <div className="source-icon">
                      <SourceIcon url={doc.url} />
                    </div>
                    <div className="source-info">
                      <p className="source-title">{doc.title || 'Untitled'}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="response-text">
            <div className="response-header">
              <FaRobot />
              <span>Assistant's Response</span>
            </div>
            <p style={{ textAlign: 'left' }}>{chat.text}</p>
          </div>
        </div>
      )}
    </div>
  );
};