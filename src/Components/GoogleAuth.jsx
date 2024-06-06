// import React from 'react';
// import GoogleButton from 'react-google-button'; // Using Google button component
// const googleClientId = "Your_actual_google_client_id";
// const apiBaseURL = "https://chatpro-algohype.replit.app";
// const onGoogleLoginSuccess = () => {
//   const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
//   const redirectUri = 'api/v1/auth/login/google/';
//   const apiBaseURL = 'https://chatpro-algohype.replit.app'
//   const scope = [
//     'https://www.googleapis.com/auth/userinfo.email',
//     'https://www.googleapis.com/auth/userinfo.profile'
//   ].join(' ');
//   const params = {
//     response_type: 'code',
//     client_id: "728707222998-b1odghk030ggv5cgjna8f74orb9jlo0o.apps.googleusercontent.com",
//     redirect_uri: `${apiBaseURL}/${redirectUri}`,
//     prompt: 'select_account',
//     access_type: 'offline',
//     scope
//   };
//   const urlParams = new URLSearchParams(params).toString();
//   window.location = `${googleAuthUrl}?${urlParams}`;
// };

// export default onGoogleLoginSuccess;


import React, { useEffect } from 'react';
import GoogleButton from 'react-google-button';
import axios from 'axios';

const googleClientId = "728707222998-b1odghk030ggv5cgjna8f74orb9jlo0o.apps.googleusercontent.com";
const apiBaseURL = "https://chatpro-algohype.replit.app";

const Demo = () => {
  const onGoogleLoginSuccess = () => {
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const redirectUri = 'api/v1/auth/login/google/';
    const scope = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ');

    const params = {
      response_type: 'code',
      client_id: googleClientId,
      redirect_uri: `${apiBaseURL}/${redirectUri}`,
      prompt: 'select_account',
      access_type: 'offline',
      scope
    };

    const urlParams = new URLSearchParams(params).toString();
    window.location = `${googleAuthUrl}?${urlParams}`;
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const extractUserInfo = async () => {
    try {
      const response = await axios.get(`${apiBaseURL}/api/v1/auth/user-info`, {
        withCredentials: true
      });
      console.log('User Info:', response.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      const fetchToken = async () => {
        try {
          const response = await axios.get(`${apiBaseURL}/api/v1/auth/login/google/?code=${code}`, {
            withCredentials: true
          });
          if (response.ok) {
            const userInfo = response.headers['user_info'];
            console.log('User Info:', userInfo);

            const jwtToken = getCookie('dsandeavour_access_token');
            console.log('JWT Token:', jwtToken);
          } else {
            console.error('Error during Google login:', response.statusText);
          }
        } catch (error) {
          console.error('Error during Google login:', error);
        }
      };
      fetchToken();
    }
  }, []);

  return (
    <div>
      <GoogleButton onClick={onGoogleLoginSuccess} />
    </div>
  );
};

export default Demo;











