import React, { useEffect } from "react";
import Tagged from "../rc/Tagged";
import Saved from "../rc/Saved";
import { useDispatch } from "react-redux";
import { setCurrPage } from "../../../Context/features/Reducer";

const Profile = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrPage(3));
    return () => {
      dispatch(setCurrPage());
    };
  }, []);
  return (
    <div>
      <section>
        <Tagged />
      </section>
      <section>
        <Saved />
      </section>
    </div>
  );
};

export default Profile;
