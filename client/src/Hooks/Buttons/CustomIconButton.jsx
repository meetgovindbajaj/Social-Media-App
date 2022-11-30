import { Fade, IconButton, Tooltip } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

const CustomIconButton = ({
  children,
  title = "Button",
  color = "white",
  onClick = () => {},
}) => {
  return (
    <Tooltip
      title={title}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 400 }}
    >
      <IconButton onClick={onClick} sx={{ color, my: 1, mx: 2 }} size="large">
        {children}
      </IconButton>
    </Tooltip>
  );
};
CustomIconButton.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string,
  color: PropTypes.string,
};
export default CustomIconButton;
