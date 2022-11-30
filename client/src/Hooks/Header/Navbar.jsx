import { NavLink } from "react-router-dom";
import React from "react";
import ModeSwitchButton from "../Buttons/ModeSwitchButton";
import { useDispatch, useSelector } from "react-redux";
import { setnewPostTrue } from "../../Context/features/Reducer";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.Reducer.user);
  const currPageIndex = useSelector((state) => state.Reducer.currPageIndex);
  const openCreate = () => {
    dispatch(setnewPostTrue());
  };
  return user ? (
    <>
      <div className="app--navbar-top">
        <NavLink to="/" className="app--navbar-logo">
          logo
        </NavLink>
        <div className="app--navbar-header-extra">
          <ModeSwitchButton />
          <section>me</section>
        </div>
      </div>
      <div className="app--navbar">
        <section className="app--navbar-header">
          <NavLink to="/" className="app--navbar-logo">
            logo
          </NavLink>
        </section>
        <NavLink to="/accounts/edit" className="app--navbar-item">
          1
        </NavLink>
        <div
          style={{ cursor: "pointer" }}
          onClick={openCreate}
          className="app--navbar-item"
        >
          2
        </div>
        <NavLink to="/accounts/notifications" className="app--navbar-item">
          3
        </NavLink>
        <NavLink to="/accounts" className="app--navbar-item">
          4
        </NavLink>
        <NavLink
          to="/direct/inbox"
          className="app--navbar-item app--navbar-extra"
        >
          5
        </NavLink>
        <NavLink
          to="/direct/t/chat"
          className="app--navbar-item app--navbar-extra"
        >
          6
        </NavLink>
        <NavLink
          to="/accounts/login"
          className="app--navbar-item app--navbar-extra"
        >
          7
        </NavLink>
        <NavLink
          to="/accounts/edit"
          className="app--navbar-item app--navbar-extra"
        >
          8
        </NavLink>
      </div>
    </>
  ) : currPageIndex !== 4 ? (
    <>
      <div className="app--navbar-top">
        <NavLink to="/accounts/login" className="app--navbar-logo">
          logo
        </NavLink>
      </div>
      <div className="app--navbar">
        <section className="app--navbar-header">
          <NavLink to="/accounts/login" className="app--navbar-logo">
            logo
          </NavLink>
        </section>
        <NavLink to="/accounts/login" className="app--navbar-item">
          login
        </NavLink>
      </div>
    </>
  ) : (
    <></>
  );
};

export default Navbar;
