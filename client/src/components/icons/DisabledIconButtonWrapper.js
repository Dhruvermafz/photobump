import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles, IconButton } from "@mui/material";
const styles = (theme) => ({
  iconButton: {
    color: "#fff !important",
  },
  disabledNavButton: {
    opacity: "0.54",
  },
});

export const styledIconButton = (props) => {
  const { classes, children, isDisabled } = props;
  return (
    <IconButton
      className={
        isDisabled
          ? classNames(classes.iconButton, classes.disabledNavButton)
          : classes.iconButton
      }
      disabled={isDisabled}
    >
      {children}
    </IconButton>
  );
};

styledIconButton.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  isDisabled: PropTypes.bool,
};

const StyledIconButtonWrapper = withStyles(styles)(styledIconButton);

export const DisabledIconButton = (props) => {
  const { isDisabled, children, component: Component, ...rest } = props;
  return Component && !isDisabled ? (
    <Component {...rest}>
      <StyledIconButtonWrapper>{children}</StyledIconButtonWrapper>
    </Component>
  ) : (
    <StyledIconButtonWrapper isDisabled={isDisabled}>
      {children}
    </StyledIconButtonWrapper>
  );
};

DisabledIconButton.propTypes = {
  isDisabled: PropTypes.bool,
  children: PropTypes.element.isRequired,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
};

export default withStyles(styles)(DisabledIconButton);
