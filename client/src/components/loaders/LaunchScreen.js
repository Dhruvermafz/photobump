import React from "react";
import PropTypes from "prop-types";
import { LinearProgress, withStyles, Typography } from "@mui/material";
const LaunchScreen = ({ classes }) => (
  <div className={classes.root}>
    <LinearProgress color="secondary" />
    <Typography
      className={classes.brandText}
      align="center"
      variant="h2"
      color="inherit"
    >
      Snaps App
    </Typography>
  </div>
);

LaunchScreen.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  root: {
    background: `linear-gradient(to right bottom, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 33% , ${theme.palette.primary.dark} 67%)`,
    height: "100vh",
    position: "relative",
  },
  brandText: {
    position: "absolute",
    top: "60%",
    left: "50%",
    transform: "translateX(-50%)",
    color: "#fff",
    [theme.breakpoints.up("xl")]: {
      top: "70%",
    },
  },
  linearProgress: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export default withStyles(styles)(LaunchScreen);
