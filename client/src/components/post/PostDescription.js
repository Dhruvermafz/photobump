import React from "react";
import { withStyles, Typography } from "@mui/material";
import PropTypes from "prop-types";
import moment from "moment";

export const PostDescription = (props) => {
  const { classes, description, createdAt } = props;
  return (
    <div className={classes.root}>
      <Typography variant="caption">{moment(createdAt).fromNow()}</Typography>
      <Typography variant="body2">{description}</Typography>
    </div>
  );
};

PostDescription.propTypes = {
  classes: PropTypes.object.isRequired,
  createdAt: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
};

const styles = (theme) => ({
  root: {
    marginTop: `${theme.spacing.unit}px`,
    marginLeft: `${theme.spacing.unit}px`,
  },
});

export default withStyles(styles)(PostDescription);
