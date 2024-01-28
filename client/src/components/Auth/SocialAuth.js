import React from "react";
import { Typography, Paper, Button, withStyles } from "@mui/material";
import classNames from "classnames";
import PropTypes from "prop-types";
import {
  Google as GoogleIcon,
  Facebook as FacebookIcon,
} from "@mui/icons-material";
export const SocialAuth = (props) => {
  const { classes, registerOrLogin } = props;
  return (
    <React.Fragment>
      <main className={classes.layout}>
        <Paper>
          <Typography variant="caption" align="center">
            {registerOrLogin === "register" ? "Register with:" : "Login with:"}
          </Typography>
          <div className={classes.buttonContainer}>
            <Button
              href="/auth/facebook"
              variant="contained"
              color="primary"
              className={classNames(
                classes.socialButtons,
                classes.facebookButton
              )}
            >
              <FacebookIcon classes={{ root: classes.icons }} />
            </Button>
            <Button
              href="/auth/google"
              variant="contained"
              color="primary"
              className={classNames(
                classes.socialButtons,
                classes.googleButton
              )}
            >
              <GoogleIcon classes={{ root: classes.icons }} />
            </Button>
          </div>
        </Paper>
      </main>
    </React.Fragment>
  );
};

SocialAuth.propTypes = {
  registerOrLogin: PropTypes.oneOf(["register", "login"]),
};

const styles = (theme) => ({
  layout: {
    width: "90%",
    margin: "0 auto",
    [theme.breakpoints.up("sm")]: {
      width: "70%",
    },
    [theme.breakpoints.up("md")]: {
      width: "60%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "40%",
    },
    [theme.breakpoints.up("xl")]: {
      width: "30%",
    },
  },
  paper: {
    maxHeight: "400px",
    padding: `${theme.spacing.unit}px`,
    overflow: "hidden",
    overflowY: "auto",
  },
  buttonContainer: {
    margin: "0 auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: `${theme.spacing.unit}px`,
  },
  socialButtons: {
    height: "50px",
    margin: "8px",
    width: "50px",
  },
  googleButton: {
    background: "#fa5432",
    marginBottom: `${theme.spacing.unit}px`,
  },
  facebookButton: {
    background: "#4b70ab",
    marginBottom: `${theme.spacing.unit}px`,
  },
  icons: {
    fill: "#fff",
  },
  aTag: {
    color: "inherit",
    textDecoration: "none",
  },
});

export default withStyles(styles)(SocialAuth);
