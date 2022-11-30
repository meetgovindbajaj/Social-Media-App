// @route dependencies
import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
// @route hooks
import ScrollToTop from "../Hooks/ScrollToTop/ScrollToTop.jsx";
import Wrapper from "../Hooks/ErrorWrapper/Wrapper";
// @route components
import Home from "../Components/Home/main/Home";
import Error from "../Components/Error/Error";
import SinglePost from "../Components/SinglePost/main/SinglePost.jsx";
const Inbox = lazy(() => import("../Components/Chat/main/Inbox"));
const Profile = lazy(() => import("../Components/Profile/main/Profile"));
const Auth = lazy(() => import("../Components/Authentication/main/Auth"));
const Settings = lazy(() => import("../Components/Setting/main/Settings"));

const Routers = () => {
  return (
    <Wrapper
      children={
        <ScrollToTop
          children={
            <Routes
              children={
                <>
                  {/* @route home_page */}
                  <Route path="/" element={<Home />} />

                  {/* @route single_post_page */}
                  <Route path="/post/:postId" element={<SinglePost />} />

                  {/* @route chat_page */}
                  <Route path="/direct/inbox" element={<Inbox tab={1} />} />
                  <Route path="/direct/t/:chatId" element={<Inbox tab={2} />} />

                  {/* @route profile_page */}
                  <Route path="/:tag" element={<Profile tab={1} />} />
                  <Route path="/:tag/saved" element={<Profile tab={2} />} />
                  <Route path="/:tag/tagged" element={<Profile tab={3} />} />

                  {/* @route login_page */}
                  <Route path="/accounts/login" element={<Auth />} />

                  {/* @route setting_page --edit_profile */}
                  <Route path="/accounts/edit" element={<Settings tab={1} />} />

                  {/* @route setting_page --website_theme */}
                  <Route
                    path="/accounts/theme"
                    element={<Settings tab={2} />}
                  />

                  {/* @route setting_page --change_password */}
                  <Route
                    path="/accounts/password/change"
                    element={<Settings tab={3} />}
                  />

                  {/* @route setting_page --privacy_and_security */}
                  <Route
                    path="/accounts/privacy_and_security"
                    element={<Settings tab={4} />}
                  />

                  {/* @route setting_page --notifications */}
                  <Route
                    path="/accounts/notifications"
                    element={<Settings tab={5} />}
                  />

                  {/* @route setting_page --login_activity */}
                  <Route
                    path="/accounts/login_activity"
                    element={<Settings tab={6} />}
                  />

                  {/* @route error_page */}
                  <Route path="*" element={<Error />} />
                </>
              }
            />
          }
        />
      }
    />
  );
};
export default Routers;
