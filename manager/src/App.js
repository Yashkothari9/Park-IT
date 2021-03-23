import {useState, useContext, useEffect} from "react";
import './App.css';
import AccountBox from "./components/accountBox";
import styled from "styled-components";
import {AuthContext} from "./authContext";
import {useRoutes} from "hookrouter";
import NavBar from "./nav/nav";
import {ToastContainer} from "react-toastify";

const routes = {
  '/': () => <AppContainer><AccountBox /></AppContainer>,
};

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-image: url("/images/bg.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  align-items: center;
  justify-content: center;
`;

function App() {
  const [isSignedIn, setSignIn] = useState(false);

  function authUpdate(val) {
    setSignIn(val);
  }

  useEffect(() => {
    console.log("Sign In State: ", isSignedIn);
  }, [isSignedIn]);

  const contextValue = {authUpdate};
  return <AuthContext.Provider value={contextValue}>
    <div style={{ width: "100vw", height: "100vh", background: 'rgb(31, 138, 112)'}}>
      {isSignedIn && <NavBar />}
      {useRoutes(routes)}
      <ToastContainer />
    </div>
  </AuthContext.Provider>
  // return useRoutes(routes);
}

export default App;
