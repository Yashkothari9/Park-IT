import React, { useState, useContext } from "react";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  MutedLink,
  SubmitButton,
} from "./common";
import Marginer from "../marginer";
import {AccountContext} from "./accountContext";
import {navigate} from 'hookrouter';
import Session from "react-session-api";
import {AuthContext} from "../../authContext";
import {toast} from "react-toastify";

const { REACT_APP_API_BACKEND } = process.env;// this will bring data from the env file this is used so that our authentication details would not be able 

function LoginForm(props) {
  //declaring state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitEnable, setEnabled] = useState(false);
  const { switchToSignup, switchToOTP } = useContext(AccountContext);
  const {authUpdate} = useContext(AuthContext);
  //function email
  //this function is called when the email is changed
  function onEmailChange(e) {
    let val = e.target.value;
    setEmail(val);
    setEnabled(password.length > 0 && val.length > 0);
  }

  //this function is called when the password is changed
  function onPasswordChange(p) {
    let val = p.target.value;
    setPassword(val);
    setEnabled(email.length > 0 && val.length > 0);
  }

  const success = () => toast.success("Login Successful !");
  const emailNotPresent = () => toast.error("Email ID not present! Please sign up");
  const passwordIncorrect = () => toast.error("Password Incorrect!");

  //this function is used to send a post request to backend and check the validity of the credentials entered by the user
  async function onLogin(authUpdate) {
    if (!submitEnable) return;
    console.log(`Email: ${email}, Password: ${password}`);
    let requestOptions = {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({'email': email, 'password': password}),
    };
    let res = await fetch(`${REACT_APP_API_BACKEND}/auth/sign_in`, requestOptions);
    console.log(res.status);
    if (res.status === 200) {
      //if all the details are correct then a session storage is made where a user's data is kept to efficiently use the data all over the sessions
      success();
      const data= await res.json();
      console.log(data);
      Session.set("email", data.email);
      Session.set("user_id",data._id);
      Session.set("name",data.firstName+" "+data.lastName);
      setEmail("");
      setPassword("");
      authUpdate(true);
      navigate('/map', true);//after login the user navigates to map page
      return true;
    } else if (res.status === 598) {
      emailNotPresent();
    } else if (res.status === 599) {
      passwordIncorrect();
    }else if(res.status === 420)
    {
      toast.error("Enter a valid Email Id");
    }
    authUpdate(false);
    return false;
  }
  //login form 
  return <BoxContainer>
    <FormContainer>
      <Input value={email} type="email" placeholder="Email" onChange={onEmailChange} />
      <Input value={password} type="password" placeholder="Password" onChange={onPasswordChange} />
    </FormContainer>
    <Marginer direction="vertical" margin={10} />
    <MutedLink href="#">Forget your password?</MutedLink>
    <Marginer direction="vertical" margin="1.6em" />
    <SubmitButton enabled={submitEnable} type="submit" onClick={() => onLogin(authUpdate)}>Sign In</SubmitButton>
    <Marginer direction="vertical" margin="1em" />
    <MutedLink href="#">
      Login using {" "}
      <BoldLink href="#" onClick={switchToOTP}>
        OTP
      </BoldLink>
    </MutedLink>
    <MutedLink href="#">
      Don't have an account?{" "}
      <BoldLink href="#" onClick={switchToSignup}>
        Signup
      </BoldLink>
    </MutedLink>
  </BoxContainer>
}

export default LoginForm;