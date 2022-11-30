import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrPage } from "../../../Context/features/Reducer";
import Layout from "../layout/Layout";

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.Reducer.user);
  useEffect(() => {
    dispatch(setCurrPage(4));
    return () => {
      dispatch(setCurrPage());
    };
  }, []);
  useEffect(() => {
    if (user !== false) {
      navigate("/");
    }
  }, [user]);

  return <Layout />;
};

export default Auth;
