import React from "react";
import PropTypes from "prop-types";
import { withStyles, Grid } from "@mui/material";
import PostCardLoader from "./PostCardLoader";

export const MainPageLoader = (props) => {
  const { classes } = props;
  return (
    <Grid
      justify="flex-start"
      alignItems="center"
      wrap="wrap"
      className={classes.root}
      container
      spacing={24}
    >
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <PostCardLoader className={classes.gridItem} />
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <PostCardLoader className={classes.gridItem} />
      </Grid>
      <Grid item sm={6} md={6} lg={4}>
        <PostCardLoader />
      </Grid>
      <Grid item sm={6} md={6} lg={4}>
        <PostCardLoader />
      </Grid>
      <Grid item sm={6} md={6} lg={4}>
        <PostCardLoader />
      </Grid>
      <Grid item sm={6} md={6} lg={4}>
        <PostCardLoader />
      </Grid>
    </Grid>
  );
};

const styles = (theme) => ({
  root: {
    width: "95%",
    margin: "24px auto",
  },
});

MainPageLoader.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainPageLoader);
