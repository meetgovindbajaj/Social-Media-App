import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App/main/App";
import "./Css/main/styles.css";
import store from "./Context/store/globalStore";
import { Provider } from "react-redux";
const root = ReactDOM.createRoot(document.getElementById("root"));
const Apps = () => {
  return (
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </StrictMode>
  );
};
root.render(<Apps />);
