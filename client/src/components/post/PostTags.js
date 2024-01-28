import React from "react";
import PropTypes from "prop-types";
import { withStyles, Chip } from "@mui/material";
export const PostTags = (props) => {
  const { classes, tags } = props;
  return (
    <div className={classes.root}>
      {tags.length > 0 &&
        tags.map((tag, i) => (
          <Chip key={i} label={tag} className={classes.chip} />
        ))}
    </div>
  );
};

PostTags.propTypes = {
  classes: PropTypes.object.isRequired,
  tags: PropTypes.array,
};

const styles = (theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: `8px 8px 8px 0`,
  },
  chip: {
    margin: `4px`,
  },
});

export default withStyles(styles)(PostTags);
