import React, { useEffect } from 'react';

const onGoogleLoginSuccess = () => {
  const scope = [
    `${process.env.REACT_APP_GOOGLE_APIS_URL}/userinfo.email`,
    `${process.env.REACT_APP_GOOGLE_APIS_URL}/userinfo.profile`
  ].join(' ');

  const params = {
    response_type: 'code',
    client_id: process.env.REACT_APP_CLIENT_ID,
    redirect_uri: `${process.env.REACT_APP_API_BASE_URL}/${process.env.REACT_APP_REDIRECT_URL}`,
    prompt: 'select_account',
    access_type: 'offline',
    scope
  };

  const urlParams = new URLSearchParams(params).toString();
  window.location = `${process.env.REACT_APP_GOOGLE_AUTH_URL}?${urlParams}`;
};

const extractUserInfo = () => {
  const params = new URLSearchParams(window.location.search);
  const userInfo = params.get('user_info');
  if (userInfo) {
    try {
      const parsedUserInfo = JSON.parse(userInfo);
      localStorage.setItem('user_info', JSON.stringify(parsedUserInfo));
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } catch (error) {
      console.error('Failed to parse user info:', error);
    }
  }
};

// Use useEffect to call extractUserInfo when the component mounts
const GoogleAuth = () => {
  useEffect(() => {
    extractUserInfo();
  }, []);

  return null; // This component doesn't render anything
};

export { onGoogleLoginSuccess, GoogleAuth };