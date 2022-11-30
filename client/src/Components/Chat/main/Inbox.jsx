import React, { lazy, useEffect } from "react";
import New from "../rc/New";
import { EmptyChat } from "../rc/Chat";
import { setCurrPage } from "../../../Context/features/Reducer";
import { useDispatch } from "react-redux";
const Chat = lazy(() => import("../rc/Chat"));
const tabs = {
  1: <EmptyChat />,
  2: <Chat />,
};
const Inbox = ({ tab }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrPage(2));
    return () => {
      dispatch(setCurrPage());
    };
  }, []);
  return (
    <New>
      <div>inbox</div>
      <section>{tabs[tab]}</section>
    </New>
  );
};

export default Inbox;
