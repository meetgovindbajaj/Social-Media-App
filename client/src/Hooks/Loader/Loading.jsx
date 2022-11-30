import React from "react";
import { useSelector } from "react-redux";

const Loading = ({ children, mode = 1 }) => {
  const initLoading = useSelector((state) => state.Reducer.initLoading);
  return (
    <>
      <div
        className={`animated-loader ${
          mode === 1 ? (initLoading ? "d-block" : "d-none") : ""
        }`}
      />
      {mode === 1 ? children : <></>}
    </>
  );
};
export default Loading;
