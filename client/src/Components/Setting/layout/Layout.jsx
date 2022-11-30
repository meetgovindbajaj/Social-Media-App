import React, { lazy, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { setCurrPage } from "../../../Context/features/Reducer";
import Navigator from "../rc/Navigator";
import Theme from "../rc/Theme";
import EditProfile from "../rc/EditProfile";
import PasswordChange from "../rc/PasswordChange";
import PrivacyAndSecurity from "../rc/PrivacyAndSecurity";
import Notifications from "../rc/Notifications";
import LoginActivity from "../rc/LoginActivity";
const tabs = {
  1: <EditProfile />,
  2: <Theme />,
  3: <PasswordChange />,
  4: <PrivacyAndSecurity />,
  5: <Notifications />,
  6: <LoginActivity />,
  7: <>logout</>,
};
const Layout = ({ tab }) => {
  const dispatch = useDispatch();
  const lightMode = useSelector((state) => state.Reducer.lightMode);
  useEffect(() => {
    dispatch(setCurrPage(5));
    return () => {
      dispatch(setCurrPage());
    };
  }, []);
  const borderColor = lightMode ? "var(--lm-border-c)" : "var(--dm-border-c)";
  return (
    <div className="global--container">
      <div
        className="settings--wrapper"
        style={{
          borderColor,
          backgroundColor: lightMode ? "var(--smoke)" : "var(--smoke-black)",
        }}
      >
        <section
          className="settings--navigation"
          style={{
            borderRightColor: borderColor,
          }}
        >
          <Navigator tab={tab} />
        </section>
        <section className="settings--main">{tabs[tab]}</section>
      </div>
    </div>
  );
};
Layout.propTypes = {
  tab: PropTypes.number,
};
export default Layout;
