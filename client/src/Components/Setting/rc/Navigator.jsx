import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../Context/features/Reducer";
import swal from "sweetalert";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
const swalOptions = {
  showConfirmButton: true,
  showCancelButton: true,
  closeOnConfirm: true,
  closeOnCancel: true,
  confirmButtonColor: "red",
  buttons: ["Cancel", "Logout"],
  dangerMode: true,
};

const Navigator = ({ tab }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lightMode = useSelector((state) => state.Reducer.lightMode);
  const [view, setView] = useState(tab);
  const handleChange = (event, nextView) => {
    if (nextView !== null && nextView !== 7) {
      setView((view) => (view = nextView));
    }
  };

  const handleLogout = async () => {
    const choise = await swal({
      text: "Are You Sure?",
      title: "LOGOUT",
      className: lightMode ? "light" : "dark",
      ...swalOptions,
    });
    if (choise) {
      try {
        const res = await axios.get("/api/u/l_o");
        if (res.data.status === 200) {
          dispatch(logout());
          navigate("/accounts/login");
        }
      } catch (error) {}
    }
  };
  return (
    <ToggleButtonGroup
      orientation="vertical"
      value={view}
      fullWidth
      size="large"
      exclusive
      onChange={handleChange}
    >
      <ToggleButton value={1} onClick={() => navigate("/accounts/edit")}>
        Edit Profile
      </ToggleButton>
      <ToggleButton value={2} onClick={() => navigate("/accounts/theme")}>
        Theme Mode
      </ToggleButton>
      <ToggleButton
        value={3}
        onClick={() => navigate("/accounts/password/change")}
      >
        Change Password
      </ToggleButton>
      <ToggleButton
        value={4}
        onClick={() => navigate("/accounts/privacy_and_security")}
      >
        Privacy & Security
      </ToggleButton>
      <ToggleButton
        value={5}
        onClick={() => navigate("/accounts/notifications")}
      >
        Notifications
      </ToggleButton>
      <ToggleButton
        value={6}
        onClick={() => navigate("/accounts/login_activity")}
      >
        Login Activity
      </ToggleButton>
      <ToggleButton value={7} onClick={handleLogout} sx={{ color: "red" }}>
        Log out
        <ExitToAppRoundedIcon sx={{ marginLeft: ".5rem" }} size="small" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default Navigator;
