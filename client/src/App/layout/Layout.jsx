import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Wrapper from "../../Hooks/ErrorWrapper/Wrapper";
import Navbar from "../../Hooks/Header/Navbar";
import Create from "../../Hooks/Create/Create";
import Loading from "../../Hooks/Loader/Loading";
import { Helmet } from "react-helmet";
import {
  setInitLoadingFalse,
  setInitLoadingTrue,
  setlightModeFalse,
  setlightModeTrue,
  setPost,
  setUser,
  setWidth,
} from "../../Context/features/Reducer";
import axios from "axios";
import fetch from "../../Hooks/useMiddleware";

const Layout = ({ children }) => {
  const lightMode = useSelector((state) => state.Reducer.lightMode);
  const user = useSelector((state) => state.Reducer.user);
  const currPage = useSelector((state) => state.Reducer.currPage);
  const theme = localStorage.getItem("ThemeMode");
  const dispatch = useDispatch();

  window.onresize = () => {
    dispatch(setWidth());
  };

  ScreenOrientation.onchange = () => {
    dispatch(setWidth());
  };

  const checkAuth = async () => {
    dispatch(setInitLoadingTrue());
    try {
      // const authTokenValidation = await axios.get("/api/u/l");
      const authTokenValidation = await axios.get("/api/u/l");
      if (authTokenValidation.data.status === 200) {
        dispatch(setUser(authTokenValidation.data.data));
      }
    } catch (error) {}
    dispatch(setInitLoadingFalse());
  };

  const getPosts = async () => {
    dispatch(setInitLoadingTrue());
    try {
      const getPostRes = await axios.get("/api/p");
      if (getPostRes.data.status === 200) {
        dispatch(setPost(getPostRes.data.data));
      }
    } catch (error) {}
    dispatch(setInitLoadingFalse());
  };

  useEffect(() => {
    theme === "true"
      ? dispatch(setlightModeTrue())
      : dispatch(setlightModeFalse());
    // eslint-disable-next-line
    checkAuth();
  }, []);

  const DarkTheme = createTheme({
    palette: {
      mode: lightMode ? "light" : "dark",
    },
  });

  useEffect(() => {
    setHeaders();
  }, [currPage]);

  const setHeaders = () => {
    const layout = document.getElementById("app--layout");
    const helmet = document.getElementById("app--helmet");
    let newHelmetWrapper = document.createElement("div");
    let newHelmet = document.createElement("Helmet");
    let newTitle = document.createElement("title");
    let newMeta = document.createElement("meta");
    newHelmetWrapper.id = "app--helmet";
    newTitle.innerText = `Social Media - ${currPage}`;
    newMeta.setAttribute("name", "Social Media");
    newMeta.setAttribute("content", currPage);
    newHelmet.appendChild(newTitle);
    newHelmet.appendChild(newMeta);
    newHelmetWrapper.appendChild(newHelmet);
    layout.removeChild(helmet);
    layout.appendChild(newHelmetWrapper);
  };

  useEffect(() => {
    if (user !== false) {
      getPosts();
    }
  }, [user]);

  return (
    <Wrapper
      children={
        <ThemeProvider
          theme={DarkTheme}
          children={
            <>
              <CssBaseline />
              <div
                className="app--layout"
                id="app--layout"
                data-mode={lightMode}
                children={
                  <>
                    <div id="app--helmet">
                      <Helmet>
                        <title>Social Media - {currPage}</title>
                        <meta name="Social Media" content={currPage} />
                      </Helmet>
                    </div>
                    <Create
                      children={
                        <>
                          <Navbar />
                          <Loading
                            children={
                              <Suspense
                                fallback={<Loading mode={2} />}
                                children={children}
                              />
                            }
                          />
                        </>
                      }
                    />
                  </>
                }
              />
            </>
          }
        />
      }
    />
  );
};
export default Layout;
