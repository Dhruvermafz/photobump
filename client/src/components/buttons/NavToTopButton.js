import React from "react";
import PropTypes from "prop-types";
import { withStyles, Button } from "@mui/material";
import { Navigation as NavigationIcon } from "@mui/icons-material";
export const NavToTopButton = (props) => {
  const { classes } = props;
  return (
    <Button
      id="goTopButton"
      variant="extendedFab"
      aria-label="go-top"
      className={classes.root}
      onClick={props.scrollToTop}
    >
      <NavigationIcon className={classes.navIcon} />
      Go to Top
    </Button>
  );
};

const styles = (theme) => ({
  root: {
    margin: theme.spacing.unit,
    position: "fixed",
    bottom: "5%",
    right: "5%",
    zIndex: 5000,
  },
  navIcon: {
    marginRight: theme.spacing.unit,
  },
});

NavToTopButton.propTypes = {
  classes: PropTypes.object.isRequired,
  scrollToTop: PropTypes.func.isRequired,
};

export default withStyles(styles)(NavToTopButton);
