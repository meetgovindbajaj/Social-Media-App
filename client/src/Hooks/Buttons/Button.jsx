import React from "react";
import { Button } from "@mui/material";
import PropTypes from "prop-types";

const CustomButton = ({
  text = "text",
  variant = 3,
  size = 2,
  onClick = () => {},
}) => {
  const type = {
    1: "contained",
    2: "outlined",
    3: "text",
  };
  const s = {
    1: "large",
    2: "medium",
    3: "small",
  };
  return (
    <Button
      variant={type[variant]}
      onClick={onClick}
      sx={{ color: "white" }}
      size={s[size]}
    >
      {text}
    </Button>
  );
};
CustomButton.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
  variant: PropTypes.number,
  size: PropTypes.number,
};
export default CustomButton;
