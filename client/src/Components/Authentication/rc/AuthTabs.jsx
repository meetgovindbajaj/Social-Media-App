import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Login from "./Login";
import Register from "./Register";

const AuthTabs = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`auth--tab-${index}`}
        {...other}
      >
        {value === index ? <Box sx={{ py: 3 }}>{children}</Box> : <></>}
      </div>
    );
  };

  const TabsStyle = {
    fontFamily: "sono,sans-serif",
    fontSize: "1.5rem",
    fontWeight: "bold",
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <Tabs value={value} onChange={handleChange} variant="fullWidth">
          <Tab label="Login" id="auth--tab-panel-0" sx={TabsStyle} />
          <Tab label="Register" id="auth--tab-panel-1" sx={TabsStyle} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Login />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Register />
      </TabPanel>
    </Box>
  );
};

export default AuthTabs;
