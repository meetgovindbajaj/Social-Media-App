import React from "react";
import useScript from "../../../Hooks/useScript";
import jwt_decode from "jwt-decode";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "../../../Context/features/Reducer";
import AuthTabs from "../rc/AuthTabs";
import { Divider } from "@mui/material";
const Layout = () => {
  const googleButton = useRef();
  const dispatch = useDispatch();
  const lightMode = useSelector((state) => state.Reducer.lightMode);
  const user = useSelector((state) => state.Reducer.user);

  const onGoogleSignIn = async (user) => {
    let userCred = user.credential;
    let payload = jwt_decode(userCred);
    const creds = {
      email: payload.email,
      password: "",
      loginMode: 2,
      otherInfo: payload,
    };
    const server_reg = await axios.post("/api/u/l", creds);
    if (server_reg.data.status === 200) {
      dispatch(setUser(server_reg.data.data));
    }
  };
  const onload = () => {
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: onGoogleSignIn,
      auto_select: false,
    });
    window.google.accounts.id.renderButton(googleButton.current, {
      text: "continue_with",
      width: 190,
      theme: lightMode ? "filled_blue" : "default",
    });
    // window.google.accounts.id.prompt();
  };
  useScript(onload);
  return (
    <div className="global--container">
      <div className="auth--header">
        <span className="auth--header-left">Social</span>
        <span className="auth--header-right">media</span>
      </div>
      <section className="auth--body">
        <AuthTabs />
        <Divider>Other Options</Divider>
      </section>
      <div className="w-100"></div>
      <section>
        <div className="auth--google">
          {!user ? <span ref={googleButton} /> : <></>}
        </div>
      </section>
    </div>
  );
};

export default Layout;
