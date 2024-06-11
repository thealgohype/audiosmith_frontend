import React, { useEffect } from 'react';
import GoogleButton from 'react-google-button'; 
const googleClientId = "Your_actual_google_client_id";
const apiBaseURL = "https://chatpro-algohype.replit.app";
const onGoogleLoginSuccess = () => {
  const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const redirectUri = 'api/v1/auth/login/google/';
  const apiBaseURL = 'https://chatpro-algohype.replit.app'
  const scope = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ].join(' ');
  const params = {
    response_type: 'code',
    client_id: "280359628305-kuaek7lcfr8osemo4mv799bbuaeefl39.apps.googleusercontent.com",
    redirect_uri: `${apiBaseURL}/${redirectUri}`,
    prompt: 'select_account',
    access_type: 'offline',
    scope
  };
  const urlParams = new URLSearchParams(params).toString();
  window.location = `${googleAuthUrl}?${urlParams}`;
 
};

// useEffect(()=>{
//   
// })
const extractUserInfo = () => {
  const params = new URLSearchParams(window.location.search);
  const userInfo = params.get('user_info');
  if (userInfo) {
    try {
      const parsedUserInfo = JSON.parse(userInfo);
      // console.log('User Info:', parsedUserInfo);
      // Store the user info as needed, e.g., in localStorage or state
      localStorage.setItem('user_info', JSON.stringify(parsedUserInfo));
      // Remove the query parameters from the URL
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } catch (error) {
      console.error('Failed to parse user info:', error);
    }
  }
};
extractUserInfo()

  // useEffect(() => {
  //   extractUserInfo();
  // }, []);


export default onGoogleLoginSuccess;



// import React, { useEffect } from 'react';
// import GoogleButton from 'react-google-button'; // Using Google button component
// const googleClientId = "280359628305-kuaek7lcfr8osemo4mv799bbuaeefl39.apps.googleusercontent.com";
// const apiBaseURL = "https://0a718918-e86b-4781-9506-c240bcf21ab3-00-2tghqb6ph9jh2.pike.replit.dev";
// const onGoogleLoginSuccess = () => {
//   const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
//   const redirectUri = 'api/v1/auth/login/google/';
//   const scope = [
//     'https://www.googleapis.com/auth/userinfo.email',
//     'https://www.googleapis.com/auth/userinfo.profile'
//   ].join(' ');
//   const params = {
//     response_type: 'code',
//     client_id: googleClientId,
//     redirect_uri: `${apiBaseURL}/${redirectUri}`,
//     prompt: 'select_account',
//     access_type: 'offline',
//     scope
//   };
//   const urlParams = new URLSearchParams(params).toString();
//   window.location = `${googleAuthUrl}?${urlParams}`;
// };
// const extractUserInfo = () => {
//   const params = new URLSearchParams(window.location.search);
//   const userInfo = params.get('user_info');
//   if (userInfo) {
//     try {
//       const parsedUserInfo = JSON.parse(userInfo);
//       console.log('User Info:', parsedUserInfo);
//       // Store the user info as needed, e.g., in localStorage or state
//       localStorage.setItem('user_info', JSON.stringify(parsedUserInfo));
//       // Remove the query parameters from the URL
//       const newUrl = window.location.origin + window.location.pathname;
//       window.history.replaceState({}, document.title, newUrl);
//     } catch (error) {
//       console.error('Failed to parse user info:', error);
//     }
//   }
// };
// const GoogleLoginButton = () => {
//   useEffect(() => {
//     extractUserInfo();
//   }, []);
//   return (
//     <GoogleButton onClick={onGoogleLoginSuccess} label="Sign in with Google" />
//   );
// };
// export default GoogleLoginButton;






