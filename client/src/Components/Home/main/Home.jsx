import { Box, Button, Fab, Fade, useScrollTrigger } from "@mui/material";
import React, { lazy, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, setCurrPage } from "../../../Context/features/Reducer.js";
import ModeSwitchButton from "../../../Hooks/Buttons/ModeSwitchButton.jsx";
// import CustomCardDesktop from "../../../Hooks/Cards/CustomCardDesktop.jsx";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import axios from "axios";
const CustomCardDesktop = lazy(() =>
  import("../../../Hooks/Cards/CustomCardDesktop.jsx")
);
const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const topRef = useRef();
  const user = useSelector((state) => state.Reducer.user);
  const homePE = useSelector((state) => state.Reducer.homePE);
  const post = useSelector((state) => state.Reducer.post);
  const lightMode = useSelector((state) => state.Reducer.lightMode);
  const initLoading = useSelector((state) => state.Reducer.initLoading);
  const [scrollTarget, setScrollTarget] = useState(undefined);

  const scrollTrigger = useScrollTrigger({
    target: scrollTarget,
    disableHysteresis: true,
    threshold: 1500,
  });

  useEffect(() => {
    dispatch(setCurrPage(1));
    return () => {
      dispatch(setCurrPage());
    };
  }, []);

  useEffect(() => {
    if (user === false) {
      navigate("/accounts/login");
    }
  }, [user]);

  const handleScroll = () => {
    topRef.current.scrollIntoView({
      top: topRef.current.getBoundingClientRect().top + window.pageYOffset,
      behavior: "smooth",
    });
  };

  const noPostStyle = {
    display: "grid",
    placeItems: "center",
    width: "min(480px,90vw)",
    height: "150px",
    borderRadius: "10px",
    backgroundColor: "var(--smoke-black)",
    color: "white",
    fontFamily: "sono,sans-serif",
    fontWeight: "bold",
    textAlign: "center",
    margin: "1rem auto",
    padding: ".5rem",
  };
  return (
    <>
      {initLoading ? (
        <></>
      ) : (
        <>
          <div
            className="home--container"
            ref={(node) => {
              if (node) {
                setScrollTarget(node);
              }
            }}
            style={{
              pointerEvents: homePE,
            }}
          >
            <div ref={topRef}>
              {post?.length > 0 ? (
                <>
                  {post?.map((item) => (
                    <CustomCardDesktop key={item._id} data={item} />
                  ))}
                  <div style={noPostStyle}>You're All Done For Today!</div>
                </>
              ) : (
                <div style={noPostStyle}>
                  Upload New Posts And Follow More People
                </div>
              )}
            </div>
          </div>
          <Fade in={scrollTrigger}>
            <Box
              onClick={handleScroll}
              role="presentation"
              sx={{ position: "fixed", bottom: 60, right: 16, zIndex: 111 }}
            >
              <Fab
                size="small"
                aria-label="scroll back to top"
                sx={{
                  background: lightMode
                    ? "var(--lm-app-layout-bg)"
                    : "var(--dm-app-layout-bg)",
                  color: lightMode
                    ? "var(--lm-app-layout-c)"
                    : "var(--dm-app-layout-c)",
                  ":hover": {
                    background: lightMode
                      ? "var(--lm-app-layout-bg)"
                      : "var(--dm-app-layout-bg)",
                    color: lightMode
                      ? "var(--lm-app-layout-c)"
                      : "var(--dm-app-layout-c)",
                  },
                }}
              >
                <KeyboardArrowUpIcon />
              </Fab>
            </Box>
          </Fade>
        </>
      )}
    </>
  );
};

export default Home;
