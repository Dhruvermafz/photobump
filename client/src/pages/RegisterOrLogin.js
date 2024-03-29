import React from "react";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import SocialAuth from "../components/Auth/SocialAuth";
import ToS from "../components/Auth/ToS";

export const RegisterOrLogin = (props) => {
  const { registerOrLogin } = props;
  return (
    <div>
      <Typography
        variant="h2"
        style={{ margin: "16px 0" }}
        align="center"
        color="textPrimary"
        gutterBottom
      >
        {registerOrLogin === "register" ? "Sign Up" : "Login"}
      </Typography>
      <SocialAuth registerOrLogin={registerOrLogin} />
      <ToS />
      <Typography
        to="/privacy"
        component={Link}
        variant="body2"
        align="center"
        style={{ marginTop: "8px" }}
      >
        Privacy Policy
      </Typography>
    </div>
  );
};

RegisterOrLogin.propTypes = {
  registerOrLogin: PropTypes.oneOf(["register", "login"]),
};

export default RegisterOrLogin;
