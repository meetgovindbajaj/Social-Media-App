import React, { useEffect } from "react";
import BackButtonAbs from "../../Hooks/Buttons/BackButtonAbs";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrPage } from "../../Context/features/Reducer.js";
const ErrorPage = () => {
  const navigate = useNavigate();
  const onClick = () => {
    navigate("/");
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrPage(7));
  }, []);
  return (
    <section id="error-page">
      <BackButtonAbs onClick={onClick} top="0" left="0" />
      <div className="glitch">
        <span aria-hidden="true">PAGE NOT FOUND</span>
        PAGE NOT FOUND
        <span aria-hidden="true">PAGE NOT FOUND</span>
      </div>
    </section>
  );
};

export default ErrorPage;
