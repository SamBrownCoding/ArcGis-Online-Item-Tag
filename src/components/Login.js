const Login = () => {
    const handleLogin = () => {
      const clientId = 'BlO6NupRRh9o2JkK';
      const redirectUri = 'http://localhost:3000/callback.html';
      const oauth2Url = `https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}`;
      window.location.href = oauth2Url;
    };
  
    return <button onClick={handleLogin}>Login with ArcGIS</button>;
  };
  
  export default Login;