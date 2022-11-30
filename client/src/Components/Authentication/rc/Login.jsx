import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setInitLoadingFalse,
  setInitLoadingTrue,
  setUser,
} from "../../../Context/features/Reducer";
import swal from "sweetalert";
const Login = () => {
  const [showPassword, setshowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const lightMode = useSelector((state) => state.Reducer.lightMode);
  const swalOptions = {
    buttons: false,
    closeOnEsc: false,
    closeOnClickOutside: false,
    className: lightMode ? "light" : "dark",
  };
  const emailRef = useRef(),
    passwordRef = useRef();
  const handleClickShowPassword = () => {
    setshowPassword(!showPassword);
  };
  const handleLogin = async () => {
    setLoading(true);
    dispatch(setInitLoadingTrue());
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (email && password) {
      const creds = {
        email,
        password,
        loginMode: 1,
        otherInfo: undefined,
      };
      try {
        const server_reg = await axios.post("/api/u/l", creds);
        if (server_reg.data.status === 200) {
          dispatch(setUser(server_reg.data.data));
        } else {
          swal({
            icon: "error",
            text: server_reg.data.message,
            timer: 2000,
            ...swalOptions,
          });
        }
      } catch (error) {
        swal({
          icon: "error",
          text: error.response.data.message,
          timer: 2000,
          ...swalOptions,
        });
      }
    } else {
      swal({
        icon: "error",
        text: "Missing Arguments!",
        timer: 2000,
        ...swalOptions,
      });
    }
    dispatch(setInitLoadingFalse());
    setLoading(false);
  };
  return (
    <Box>
      <Grid container spacing={1.5} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="login--email"
            label="Email"
            name="login--email"
            type="email"
            inputRef={emailRef}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="login--password"
            label="Password"
            name="login--password"
            type={showPassword ? "text" : "password"}
            inputRef={passwordRef}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={loading}
                  value={showPassword}
                  onClick={handleClickShowPassword}
                />
              }
              label="Show Password"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            disabled={loading}
            onClick={handleLogin}
            variant="outlined"
            sx={{ fontFamily: "sono", fontWeight: "bold" }}
          >
            Login
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
