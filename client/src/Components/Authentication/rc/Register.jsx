import { setUser } from "../../../Context/features/Reducer";
import ReactLoading from "react-loading";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import axios from "axios";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import useDebounce from "../../../Hooks/useDebounce";

const colorMode = {
  1: "primary",
  2: "success",
  3: "error",
};
const Register = () => {
  const initialData = {
    userData: {
      name: "",
      tag: "",
      email: "",
      password: "",
      loginMode: 1,
    },
    passwordError: {
      password: false,
      confirmPassword: false,
    },
    tagError: {
      error: false,
      helperText: "Username should be unique for every user",
      checking: false,
      checked: false,
      color: colorMode[1],
    },
    emailError: {
      error: false,
      helperText: "Email should be unique for every user",
      checking: false,
      checked: false,
      color: colorMode[1],
    },
  };
  const lightMode = useSelector((state) => state.Reducer.lightMode);
  const swalOptions = {
    buttons: false,
    closeOnEsc: false,
    closeOnClickOutside: false,
    className: lightMode ? "light" : "dark",
  };
  const [showPassword, setshowPassword] = useState(false);
  const [signUpDisabled, setSignUpDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tagError, setTagError] = useState(initialData.tagError);
  const [emailError, setEmailError] = useState(initialData.emailError);
  const [passwordError, setPasswordError] = useState(initialData.passwordError);
  const [userData, setUserData] = useState(initialData.userData);
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();

  const debouncedTag = useDebounce(userData.tag);
  const debouncedEmail = useDebounce(userData.email);

  const handleClickShowPassword = () => {
    setshowPassword(!showPassword);
  };

  const handleSignUp = async () => {
    setLoading(true);
    swal({
      text: "Signing up...",
      ...swalOptions,
    });
    try {
      const server_reg = await axios.post("/api/u/r", userData);
      if (server_reg.data.status === 200) {
        swal({
          icon: "success",
          text: "Signed Up Successfully",
          timer: 2000,
          ...swalOptions,
        });
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
    setLoading(false);
  };

  const tagChecker = async (value) => {
    if (value ?? userData.tag.length > 0) {
      setTagError({ ...tagError, ...{ checked: true, checking: true } });
      if ((value ?? userData.tag).match(/^[a-z0-9._]+$/i)) {
        try {
          const tagCheckRes = await axios.get(
            `/api/u/t_c?tag=${value ?? userData.tag}`
          );
          setTagError({
            ...tagError,
            ...{
              error: tagCheckRes.data.error ?? true,
              helperText: tagCheckRes.data.message ?? "Internal Server Error!",
              checking: false,
              color:
                tagCheckRes.data.error === false ? colorMode[2] : colorMode[1],
            },
          });
        } catch (error) {
          swal({
            icon: "error",
            text: "Internal Server Error",
            timer: 2000,
            ...swalOptions,
          });
          setTagError({
            ...tagError,
            ...{
              error: true,
              helperText: "Internal Server Error!",
              checking: false,
            },
          });
        }
      } else {
        setTagError({
          ...tagError,
          ...{
            error: true,
            helperText: "Allowed : letters, numbers & symbols ( . _ )",
            checking: false,
          },
        });
      }
    } else {
      setTagError(initialData.tagError);
    }
  };

  const emailChecker = async (value) => {
    if (value ?? userData.email.length > 0) {
      setEmailError({ ...emailError, ...{ checked: true, checking: true } });
      if (
        (value ?? userData.email).match(
          // eslint-disable-next-line
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i
        )
      ) {
        try {
          const emailCheckRes = await axios.get(
            `/api/u/e_c?email=${value ?? userData.email}`
          );
          setEmailError({
            ...emailError,
            ...{
              error: emailCheckRes.data.error ?? true,
              helperText:
                emailCheckRes.data.message ?? "Internal Server Error!",
              checking: false,
              color:
                emailCheckRes.data.error === false
                  ? colorMode[2]
                  : colorMode[1],
            },
          });
        } catch (error) {
          swal({
            icon: "error",
            text: "Internal Server Error",
            timer: 2000,
            ...swalOptions,
          });
          setEmailError({
            ...emailError,
            ...{
              error: true,
              helperText: "Internal Server Error!",
              checking: false,
            },
          });
        }
      } else {
        setEmailError({
          ...emailError,
          ...{
            error: true,
            helperText: "Invalid Format",
            checking: false,
          },
        });
      }
    } else {
      setEmailError(initialData.emailError);
    }
  };

  const passwordChecker = (mode, value) => {
    switch (mode) {
      case 1:
        if (
          !value.match(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\*\.\!\@\$\%\^\&\(\)\{\}\[\]\:\;\<\>\,\?\/\~\_\+\-\=\|\\]).{8,32}$/
          ) &&
          value.length > 0
        ) {
          setPasswordError({
            ...passwordError,
            ...{ password: true },
          });
        } else {
          if (value !== confirmPassword && confirmPassword.length > 0) {
            setPasswordError({
              ...passwordError,
              ...{ password: false, confirmPassword: true },
            });
          } else {
            setPasswordError({
              ...passwordError,
              ...{ password: false, confirmPassword: false },
            });
          }
        }
        break;
      case 2:
        if (userData.password !== value && value.length > 0) {
          setPasswordError({
            ...passwordError,
            ...{ confirmPassword: true },
          });
        } else {
          setPasswordError({
            ...passwordError,
            ...{ confirmPassword: false },
          });
        }
        break;
      default:
        setPasswordError(initialData.passwordError);
        break;
    }
  };

  const handleChange = (mode, value) => {
    switch (mode) {
      case 1:
        setUserData({ ...userData, ...{ name: value } });
        break;
      case 2:
        setUserData({ ...userData, ...{ tag: value.toLocaleLowerCase() } });
        break;
      case 3:
        setUserData({ ...userData, ...{ email: value.toLocaleLowerCase() } });
        break;
      case 4:
        setUserData({ ...userData, ...{ password: value } });
        passwordChecker(1, value);
        break;
      case 5:
        setConfirmPassword(value);
        passwordChecker(2, value);
        break;
      default:
        setUserData(initialData.userData);
        setPasswordError(initialData.passwordError);
        setTagError(initialData.tagError);
        setConfirmPassword("");
        break;
    }
  };

  const isSignUpDisabled = () => {
    if (loading) {
      return true;
    } else {
      let checker = false;
      for (const key in userData) {
        if (Object.hasOwnProperty.call(userData, key)) {
          if (userData[key] === "") {
            checker = true;
            break;
          }
        }
      }
      if (
        checker === false &&
        (passwordError.password || passwordError.confirmPassword)
      ) {
        checker = true;
      }
      if (checker === false && tagError.error) {
        checker = true;
      }
      if (checker === false && emailError.error) {
        checker = true;
      }
      return checker;
    }
  };

  useEffect(() => {
    setSignUpDisabled(
      (signUpDisabled) => (signUpDisabled = isSignUpDisabled())
    ); // eslint-disable-next-line
  }, [userData, confirmPassword, tagError, passwordError, emailError]);

  useEffect(() => {
    tagChecker(debouncedTag);
  }, [debouncedTag]);

  useEffect(() => {
    emailChecker(debouncedEmail);
  }, [debouncedEmail]);

  return (
    <Box autoComplete="off">
      <Grid container spacing={1.5} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="signup--name"
            label="Full name"
            name="signup--name"
            type="text"
            InputLabelProps={{ shrink: true }}
            value={userData.name}
            onChange={(e) => {
              handleChange(1, e.target.value);
            }}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            error={tagError.error}
            helperText={tagError.helperText}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
            color={tagError.color}
            id="signup--tag"
            label="Username"
            name="signup--tag"
            type="text"
            value={userData.tag}
            inputProps={{
              maxLength: 20,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    width: "10%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {tagError.checking ? (
                    <ReactLoading
                      type="spin"
                      color="#0000FF"
                      width={30}
                      className="react-loader"
                    />
                  ) : (
                    <></>
                  )}
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              handleChange(2, e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="signup--email"
            label="Email"
            name="signup--email"
            type="email"
            error={emailError.error}
            helperText={emailError.helperText}
            color={emailError.color}
            InputLabelProps={{ shrink: true }}
            value={userData.email}
            onChange={(e) => {
              handleChange(3, e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    width: "10%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {emailError.checking ? (
                    <ReactLoading
                      type="spin"
                      color="#0000FF"
                      width={30}
                      className="react-loader"
                    />
                  ) : (
                    <></>
                  )}
                </InputAdornment>
              ),
            }}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            error={passwordError.password}
            helperText="Length (8 - 32), 1 LowerCase, 1 UpperCase, 1 Symbol, 1 Number"
            id="signup--password"
            label="Password"
            name="signup--password"
            type={showPassword ? "text" : "password"}
            InputLabelProps={{ shrink: true }}
            value={userData.password}
            onChange={(e) => {
              handleChange(4, e.target.value);
            }}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            error={passwordError.confirmPassword}
            id="signup--confirm-password"
            label="Confirm password"
            name="signup--confirm-password"
            type="text"
            InputLabelProps={{ shrink: true }}
            value={confirmPassword}
            onChange={(e) => {
              handleChange(5, e.target.value);
            }}
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
        <Grid item xs={4}>
          <Button
            fullWidth
            disabled={loading}
            color="error"
            variant="outlined"
            onClick={() => handleChange(7)}
            sx={{ fontFamily: "sono", fontWeight: "bold" }}
          >
            clear
          </Button>
        </Grid>
        <Grid item xs={8}>
          <Button
            fullWidth
            disabled={signUpDisabled}
            onClick={handleSignUp}
            variant="outlined"
            sx={{ fontFamily: "sono", fontWeight: "bold" }}
          >
            Sign Up
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Register;
